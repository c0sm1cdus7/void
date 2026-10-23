import test from 'node:test';
import assert from 'node:assert/strict';
import {compile} from 'desert-sdk/src/index.ts';
import {humanState} from 'desert-sdk/src/web/client/state.ts';
import {modelReferences} from 'desert-sdk/src/web/client/model-references.ts';
import {readScopes} from 'desert-sdk/src/web/client/view-scopes.ts';
import {TransportError,type ControllerTransport} from 'desert-sdk/src/web/client/transport.ts';
import type {HumanSurface,Prepared,RecordView} from 'desert-sdk/src/web/types.ts';
import {tasksTestProduct} from './support/tasks-host.ts';

test('project creation keeps the host draft and recovers the same receipt after unknown acceptance',async()=>{
  const product=tasksTestProduct(),application=compile(product),surface=application.surface('human') as HumanSurface;
  const scope=readScopes(product.viewProgram,surface).find(item=>item.read.id==='read-tasks')!;
  const store=humanState(surface,scope),journey=surface.journeys.find(item=>item.id==='create-project')!;
  assert.equal(journey.kind,'mutation');if(journey.kind!=='mutation')throw new Error('required');
  store.update({view:'create',draft:{title:'Keep this writing',body:'Details',projects:[]},availability:{contractDigest:surface.contractDigest,
    journeys:Object.fromEntries(surface.journeys.map(item=>[item.id,{dependenciesReady:true,blockers:[]}]))}});
  const calls:string[]=[],records:RecordView[]=[];
  const prepared:Prepared={id:'10000000-0000-4000-8000-000000000001',runId:'10000000-0000-4000-8000-000000000002',journeyId:journey.id,
    object:{id:'10000000-0000-4000-8000-000000000003',type:'project',expectedVersion:0},confirmationDigest:'confirmation',facts:{name:'Research',color:'green'}};
  const receipt={id:prepared.id,runId:prepared.runId,commandId:journey.commandId,status:'completed' as const,
    object:{id:prepared.object.id,type:'project',version:1}};
  let accepted=false;
  const transport={async evidence(){throw new Error('unused');},async call(method:string,input:Record<string,unknown>){
    calls.push(method);
    if(method==='begin')return{id:prepared.runId};
    if(method==='read')return records;
    if(method==='prepare'){assert.deepEqual(input.input,{name:'Research',color:'green'});return prepared;}
    if(method==='accept'){assert.equal(input.intentId,prepared.id);accepted=true;records.push({id:prepared.object.id,version:1,facts:prepared.facts});throw new TransportError('CONNECTION_LOST');}
    if(method==='receipt'){assert.equal(input.intentId,prepared.id);return accepted?receipt:null;}
    throw new Error(method);
  }} as ControllerTransport;
  const model=modelReferences(surface,store,transport,()=>true,(id,input)=>application.validateInput(id,input).valid,'task');
  try{
    await model.refresh();
    await model.event({kind:'reference.create',control:'projects',name:'Research',color:'green'});
    assert.equal(store.get().uncertain,true);assert.equal(store.get().references?.['task.projects']?.uncertain,true);
    assert.equal(store.get().view,'create');assert.equal(store.get().draft.title,'Keep this writing');
    await model.event({kind:'reference.create',control:'projects',name:'Research',color:'green'});
    assert.equal(calls.filter(call=>call==='prepare').length,1);
    await model.event({kind:'reference.recover',control:'projects'});
    assert.equal(store.get().uncertain,false);assert.equal(store.get().busy,false);
    assert.deepEqual(store.get().draft,{title:'Keep this writing',body:'Details',projects:[prepared.object.id]});
    assert.equal(calls.filter(call=>call==='accept').length,1,'receipt recovery does not create or accept twice');
    assert.equal(store.get().references?.['task.projects']?.options[0]?.label,'Research');
    const before=calls.length;await model.event({kind:'reference.create',control:'unknown',name:'No',color:'green'});
    assert.equal(calls.length,before);
  }finally{model.stop();store.dispose();}
});
