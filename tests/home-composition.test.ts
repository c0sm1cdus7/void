import test from 'node:test';
import assert from 'node:assert/strict';
import { VoidViewProgram, VOID } from '../src/void.product.ts';
import { compile } from 'desert-sdk/src/compile.ts';
import { compileViewProgram } from 'desert-sdk/src/views/program.ts';
import { factReference } from 'desert-sdk/src/index.ts';
import { Objects } from '../src/modules.ts';

test('Home has one cross-module attention feed and informative widgets, never module object lists',()=>{
  const home=VoidViewProgram.views.find(view=>view.id==='home')!;
  assert.equal(home.content.filter(item=>item.kind==='attention').length,1);
  const stacks=home.content.filter(item=>item.kind==='stack');
  assert.deepEqual(stacks.map(item=>item.title),['Widgets']);
  const widget=stacks[0]!.items[0]!;
  assert.equal(widget.kind,'collection');
  if(widget.kind!=='collection')throw Error('widget missing');
  assert.equal(widget.presentation?.kind,'summary-widget');
  const journey=VoidViewProgram.journeys.find(item=>item.id==='home')!;
  assert.equal(journey.outputs.find(item=>item.output===widget.output)?.action.kind,'journey');
  assert.ok(!journey.outputs.some(item=>item.action.kind==='select'));
});

test('widget metrics consume published facts, reject omitted enum values and cannot invoke writes',()=>{
  const surface=compile(VOID).surface('human');
  const change=(mutate:(value:any)=>void)=>{
    const value=structuredClone(VoidViewProgram);mutate(value);return value;
  };
  assert.deepEqual(factReference(Objects.Task,'status'),{object:'task',field:'status'});
  assert.throws(()=>factReference({...Objects.Task} as typeof Objects.Task,'status'),/UNREGISTERED_MODULE_REFERENCE/);
  assert.throws(()=>compileViewProgram(change(value=>{
    value.journeys.find((item:any)=>item.id==='home').collections[0].summary.segments.pop();
  }),surface),/INVALID_VIEW_PROGRAM/);
  assert.throws(()=>compileViewProgram(change(value=>{
    value.journeys.find((item:any)=>item.id==='home').collections[0].summary.field.field='title';
  }),surface),/INVALID_WIDGET_FIELD/);
  assert.throws(()=>compileViewProgram(change(value=>{
    value.journeys.find((item:any)=>item.id==='home').outputs.find((item:any)=>item.output==='tasks').action.journey='create-task';
  }),surface),/INVALID_WIDGET_ACTION/);
});
