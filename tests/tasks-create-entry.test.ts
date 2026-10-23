import test from 'node:test';
import assert from 'node:assert/strict';
import {tasksTestProduct} from './support/tasks-host.ts';
import {compile} from 'desert-sdk/src/index.ts';
import {readScopes} from 'desert-sdk/src/web/client/view-scopes.ts';
import {referenceScopeSurface} from 'desert-sdk/src/web/client/model-scope.ts';
import {humanState} from 'desert-sdk/src/web/client/state.ts';
import {modelReferences} from 'desert-sdk/src/web/client/model-references.ts';
import {humanProduct} from 'desert-sdk/src/web/client/model.ts';
import {presentFrame} from 'desert-sdk/src/web/client/frame.ts';
import type {HumanSurface} from 'desert-sdk/src/web/types.ts';
import type {ControllerTransport} from 'desert-sdk/src/web/client/transport.ts';
import {compileViewProgram} from 'desert-sdk/src/views/program.ts';

test('Tasks + exposes separate task and project creation with a real project form',()=>{
  const program=tasksTestProduct().viewProgram;
  const tasks=program.views.find(view=>view.id==='tasks')!;
  assert.equal(tasks.topDock?.actionGroup,'create');
  assert.deepEqual(tasks.topDock?.actions.map(action=>action.label),['Create task','Create project']);
  const create=program.journeys.find(journey=>journey.id==='create-project')!;
  assert.equal(create.kind,'create');
  assert.equal(create.view,'project-editor');
  const editor=program.views.find(view=>view.id==='project-editor')!;
  assert.ok(editor.content.some(content=>content.kind==='form'));
  assert.equal(editor.topDock?.actions[0]?.icon,'close');
  assert.equal(editor.bottomDock?.actions[0]?.label,'Save project');
});

test('Projects selection-only removes companion creation from its scope, projection and programmatic events without changing authority',async()=>{
  const product=tasksTestProduct(),app=compile(product),surface=app.surface('human') as HumanSurface;
  const before=JSON.stringify(surface),scope=readScopes(product.viewProgram,surface).find(scope=>scope.read.id==='read-tasks')!;
  assert.equal(scope.referenceCreation,'separate');
  const selection=referenceScopeSurface(surface,scope);
  assert.equal(selection.fieldReferences?.['task.projects']?.create,undefined);
  assert.equal(surface.fieldReferences?.['task.projects']?.create,'create-project','canonical authority remains installed');
  assert.equal(selection.contractDigest,surface.contractDigest);
  const store=humanState(surface,scope),calls:string[]=[];
  const transport={async call(method:string){calls.push(method);throw new Error('No controller operation is permitted');}} as unknown as ControllerTransport;
  const model=modelReferences(selection,store,transport,()=>true,(id,input)=>app.validateInput(id,input).valid,'task');
  try{
    store.update({view:'create',draft:{title:'Keep draft',body:'',projects:[]},availability:{contractDigest:surface.contractDigest,
      journeys:Object.fromEntries(surface.journeys.map(journey=>[journey.id,{dependenciesReady:true,blockers:[]}]))}});
    await model.event({kind:'reference.create',control:'projects',name:'Forbidden nested project',color:'blue'});
    await model.event({kind:'reference.recover',control:'projects'});
    assert.deepEqual(calls,[],'no begin, prepare, accept or recovery without the scoped create capability');
    const frame=presentFrame(surface,store.get(),(id,input)=>app.validateInput(id,input).valid,scope);
    assert.equal(frame.content.kind,'form');
    if(frame.content.kind==='form'){
      const projects=frame.content.fields.find(field=>field.name==='projects');
      assert.ok(projects?.primitive==='control.labels');
      assert.equal(projects.reference?.createLabel,undefined,'even the initial loading projection cannot flash a nested creation affordance');
    }
    assert.equal(JSON.stringify(surface),before);
  }finally{model.stop();store.dispose();}
});

test('reference creation narrowing is a finite read-journey policy, not an arbitrary action capability',()=>{
  const product=tasksTestProduct(),program=product.viewProgram,surface=compile(product).surface('human');
  assert.doesNotThrow(()=>compileViewProgram(program,surface));
  for(const [id,referenceCreation] of [['read-tasks','inline'],['create-task','separate']])assert.throws(()=>compileViewProgram({...program,
    journeys:program.journeys.map(journey=>journey.id===id ? {...journey,referenceCreation} : journey)},surface),/INVALID_VIEW_PROGRAM/);
});

test('the complete Tasks model enforces selection-only even for forged companion events',async()=>{
  const product=tasksTestProduct(),app=compile(product),surface=app.surface('human') as HumanSurface;
  const scope=readScopes(product.viewProgram,surface).find(scope=>scope.read.id==='read-tasks')!;
  const calls:string[]=[];
  const model=humanProduct(surface,(id,input)=>app.validateInput(id,input).valid,{scope,
    transport:{async call(method:string){calls.push(method);if(method==='begin')return {id:'10000000-0000-4000-8000-000000000001'};
      if(method==='read')return [];throw new Error(`Unexpected ${method}`);}} as unknown as ControllerTransport,
    observeConnection:publish=>{publish({contractDigest:surface.contractDigest,journeys:Object.fromEntries(surface.journeys.map(journey=>
      [journey.id,{dependenciesReady:true,blockers:[]}]))});return ()=>{};}});
  try{
    await model.start();model.create('create-task');await model.refresh();calls.length=0;
    await model.referenceEvent({kind:'reference.create',control:'projects',name:'No nested project',color:'blue'});
    await model.referenceEvent({kind:'reference.recover',control:'projects'});
    assert.deepEqual(calls,[]);
    assert.equal(model.snapshot().references?.['task.projects']?.createLabel,undefined);
  }finally{model.dispose();}
});
