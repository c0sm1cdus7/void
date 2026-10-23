import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { compile } from "desert-sdk/src/index.ts";
import { viewProgramModel } from "desert-sdk/src/web/client/view-program.ts";
import { bindViewEvents } from "desert-sdk/src/web/client/view-events.ts";
import type { HumanSurface } from "desert-sdk/src/web/types.ts";
import type { ControllerTransport } from "desert-sdk/src/web/client/transport.ts";
import { TransportError } from "desert-sdk/src/web/client/transport.ts";
import { VoidProduct, VoidViewProgram } from "../src/void.product.ts";
import { Journeys } from "../src/modules.ts";
import type { DraftFileHost } from "desert-sdk/src/interaction/image-input.ts";
import type { FileNode } from "desert-sdk/src/interaction/control-nodes.ts";

const collectionId="b7000000-0000-4000-8000-000000000001";
const memberId="b7000000-0000-4000-8000-000000000002";
async function until(predicate:()=>boolean) {
  for(let i=0;i<200;i++){if(predicate())return;await delay(10);}
  throw new Error("MEDIA_NAVIGATION_TIMEOUT");
}

async function fixture(t: TestContext, files?: DraftFileHost, writes=false) {
  const app=compile(VoidProduct), surface=app.surface("human") as HumanSurface;
  const runs=new Map<string,{journeyId:string;subject?:string}>();
  const calls:string[]=[];
  const collections=[{id:collectionId,version:1,facts:{title:"Japan",layout:"list",cover:writes?[memberId]:[] as string[]}}];
  const media=[{id:memberId,version:1,facts:{title:"",image:{kind:"asset",reference:"b7000000-0000-4000-8000-000000000003"},fit:"fill",description:"",collections:[collectionId]}},
    {id:"b7000000-0000-4000-8000-000000000004",version:1,facts:{title:"",image:{kind:"asset",reference:"b7000000-0000-4000-8000-000000000005"},fit:"fill",description:"",collections:[]}}];
  const prepared=new Map<string,any>(),receipts=new Map<string,any>(),accepted:string[]=[];
  const faults={membership:false,uncertain:false,available:true,dropAfterPrimary:false};
  const record=(id:string)=>[...collections,...media].find(record=>record.id===id)!;
  const transport={evidence:async()=>{
      if(!faults.available)throw new TransportError('CONTROLLER_UNAVAILABLE');
      return {snapshot:{contractDigest:surface.contractDigest,journeys:Object.fromEntries(surface.journeys.map(journey=>[journey.id,{dependenciesReady:true,blockers:[]}]))},validForMs:5000};},
    call:async(method:string,input:any)=>{
      calls.push(method);
      if(method==="begin"){const id=`run-${runs.size}`;runs.set(id,input);return{id};}
      if(method==="read"){
        const run=runs.get(input.runId)!;
        const records=run.journeyId===Journeys.readCollections.id ? collections : run.journeyId===Journeys.readImages.id ? media : [];
        return structuredClone(run.subject ? records.filter(record=>record.id===run.subject) : records);
      }
      if(method==="offer")return{journeyId:input.journeyId,subject:input.subject,version:record(input.subject)?.version ?? 1,eligible:true};
      if(method==="activityList")return{items:[]};
      if(writes && method==='prepare'){
        const run=runs.get(input.runId)!,target=record(run.subject!);
        const journey=surface.journeys.find(journey=>journey.id===run.journeyId)!;
        if(journey.kind!=='mutation')throw new Error('Expected mutation');
        if(faults.membership && target.id===memberId){faults.membership=false;throw new TransportError('STALE_RECORD');}
        assert.equal(input.options.expectedVersion,target.version);
        const value={id:`intent-${prepared.size}`,runId:input.runId,journeyId:journey.id,commandId:journey.commandId,
          confirmationDigest:'digest',facts:input.input,object:{id:target.id,type:journey.object,expectedVersion:target.version}};
        prepared.set(value.id,value);return value;
      }
      if(writes && method==='accept'){
        const intent=prepared.get(input.intentId)!,target=record(intent.object.id);
        assert.equal(receipts.has(intent.id),false,'an accepted intent is never resubmitted');
        Object.assign(target.facts,intent.facts);target.version++;accepted.push(intent.journeyId);
        const receipt={id:intent.id,runId:intent.runId,commandId:intent.commandId,status:'completed',object:{id:target.id,type:intent.object.type,version:target.version}};
        receipts.set(intent.id,receipt);
        if(faults.dropAfterPrimary && target.id===collectionId){faults.dropAfterPrimary=false;faults.available=false;await delay(300);}
        if(faults.uncertain && target.id===memberId){faults.uncertain=false;throw new TransportError('NETWORK_UNAVAILABLE');}
        return receipt;
      }
      if(writes && method==='receipt')return receipts.get(input.intentId) ?? null;
      throw new Error(`Unexpected operation ${method}`);
    }} as unknown as ControllerTransport;
  const model=viewProgramModel(VoidViewProgram,surface,(id,input)=>app.validateInput(id,input).valid,transport,undefined,files,
    {load:()=>null,save:()=>{},clear:()=>{},createOccurrence:()=>"unused"});
  t.after(()=>model.stop()); await model.start(); model.navigate("media");
  await until(()=>{const value=model.snapshot().resolved.bindings.collections;return value?.kind==="collection" && value.loaded;});
  return {model,calls,media,collections,accepted,faults};
}

async function openCollection(model: ReturnType<typeof viewProgramModel>) {
  let snapshot=model.snapshot();
  bindViewEvents(snapshot.resolved.owner,model.event)({kind:"surface.invoke",intent:{kind:"view.output",view:snapshot.resolved.view.id,output:"collection",recordId:collectionId}});
  await until(()=>model.snapshot().state.detail?.id===collectionId);
  snapshot=model.snapshot(); assert.equal(snapshot.panel,null); assert.equal(snapshot.activeDestination,"media-collection");
  await until(()=>{const value=model.snapshot().resolved.bindings.media;return value?.kind==="collection" && value.loaded;});
}

async function editCollection(model: ReturnType<typeof viewProgramModel>) {
  const snapshot=model.snapshot(),edit=snapshot.resolved.top?.trailing?.find(action=>action.intent.kind==='journey');
  assert.ok(edit);bindViewEvents(snapshot.resolved.owner,model.event)({kind:'surface.invoke',intent:edit.intent});
  await until(()=>model.snapshot().panel?.body?.relations?.groups[0]?.items.length===2 &&
    !model.snapshot().panel?.body?.relations?.groups[0]?.loading);
}
function panelEvent(model:ReturnType<typeof viewProgramModel>,event:Parameters<ReturnType<typeof bindViewEvents>>[0]) {
  const panel=model.snapshot().panel;assert.ok(panel);bindViewEvents(panel.owner,model.event)(event);
}
function uncheckCover(model:ReturnType<typeof viewProgramModel>) {
  const group=model.snapshot().panel!.body!.relations!.groups[0]!;
  panelEvent(model,{kind:'related.change',input:group.input,id:memberId,checked:false});
}
function saveCollection(model:ReturnType<typeof viewProgramModel>) {
  const action=model.snapshot().panel?.frame.bottom.primary;assert.ok(action);
  panelEvent(model,{kind:'surface.invoke',intent:action.intent});
}

test('collection membership and cover changes are drafts; Cancel writes nothing',async t=>{
  const {model,calls,media,collections}=await fixture(t,undefined,true);
  await openCollection(model);await editCollection(model);uncheckCover(model);
  await until(()=>{const cover=model.snapshot().state.draft.cover;return Array.isArray(cover) && cover.length===0;});
  assert.equal(model.snapshot().panel?.body?.relations?.dirty,true);
  assert.equal(calls.includes('prepare'),false);assert.equal(calls.includes('accept'),false);
  panelEvent(model,{kind:'surface.invoke',intent:{kind:'close'}});
  assert.equal(model.snapshot().panel,null);
  assert.deepEqual(media[0]!.facts.collections,[collectionId]);assert.deepEqual(collections[0]!.facts.cover,[memberId]);
  await editCollection(model);
  assert.equal(model.snapshot().panel!.body!.relations!.groups[0]!.items[0]!.checked,true);
});

for(const uncertain of [false,true])test(`collection Save retains editor and resumes only membership after ${uncertain?'uncertain':'known'} interruption`,async t=>{
  const {model,media,collections,accepted,faults}=await fixture(t,undefined,true);
  await openCollection(model);await editCollection(model);uncheckCover(model);
  await until(()=>{const cover=model.snapshot().state.draft.cover;return Array.isArray(cover) && cover.length===0;});
  if(uncertain)faults.uncertain=true;else faults.membership=true;
  saveCollection(model);
  await until(()=>Boolean(model.snapshot().panel?.body?.relations?.groups[0]?.error));
  const panel=model.snapshot().panel!;assert.equal(panel.locked,true);
  assert.equal(panel.frame.content.kind,'form');
  if(panel.frame.content.kind==='form')assert.ok(panel.frame.content.fields.every(field=>field.disabled));
  assert.deepEqual(collections[0]!.facts.cover,[],'removed cover falls back before membership is committed');
  assert.equal(accepted.length,uncertain?2:1);
  panelEvent(model,{kind:'surface.invoke',intent:{kind:'close'}});assert.ok(model.snapshot().panel,'cannot discard a partially saved operation');
  panelEvent(model,{kind:'related.recover',input:panel.body!.relations!.groups[0]!.input});
  await until(()=>model.snapshot().panel===null);
  assert.deepEqual(media[0]!.facts.collections,[]);assert.equal(accepted.length,2,'primary save is never repeated');
  assert.equal(model.snapshot().state.detail?.id,collectionId);
});

test('availability loss after the collection save retains a recoverable membership editor',async t=>{
  const {model,media,accepted,faults}=await fixture(t,undefined,true);
  await openCollection(model);await editCollection(model);uncheckCover(model);
  await until(()=>{const cover=model.snapshot().state.draft.cover;return Array.isArray(cover) && cover.length===0;});
  faults.dropAfterPrimary=true;saveCollection(model);
  await until(()=>Boolean(model.snapshot().panel?.body?.relations?.groups[0]?.error));
  assert.equal(accepted.length,1);assert.equal(model.snapshot().panel?.locked,true);
  assert.equal(model.snapshot().panel?.body?.relations?.groups[0]?.disabled,true);
  faults.available=true;
  await until(()=>model.snapshot().panel?.body?.relations?.groups[0]?.disabled===false);
  panelEvent(model,{kind:'related.recover',input:model.snapshot().panel!.body!.relations!.groups[0]!.input});
  await until(()=>model.snapshot().panel===null);
  assert.equal(accepted.length,2);assert.deepEqual(media[0]!.facts.collections,[]);
});

test("Media opens a main collection, scopes its members, and closes a member back to that collection", async t => {
  const {model,calls,media}=await fixture(t);
  await until(()=>{
    const collection=model.snapshot().resolved.bindings.collections;
    return collection?.kind==='collection' && collection.presentation?.kind==='collection-grid' && collection.presentation.previews[0]?.count===1;
  });
  const cards=model.snapshot().resolved.bindings.collections;
  assert.ok(cards?.kind==='collection' && cards.presentation?.kind==='collection-grid');
  assert.deepEqual(cards.presentation.previews,[{id:collectionId,count:1,media:media[0]!.facts.image}]);
  await openCollection(model);
  let snapshot=model.snapshot();
  const members=snapshot.resolved.bindings.media;
  assert.equal(members?.kind,"collection");
  if(members?.kind!=="collection")throw new Error("Missing members");
  assert.deepEqual(members.records.map(record=>record.id),[memberId]);
  assert.equal(members.presentation?.kind,'media-grid');
  if(members.presentation?.kind==='media-grid')assert.equal(members.presentation.layout,'list');
  const emit=bindViewEvents(snapshot.resolved.owner,model.event);
  assert.throws(()=>emit({kind:"surface.invoke",intent:{kind:"view.output",view:snapshot.resolved.view.id,output:"select",recordId:media[1]!.id}}),/INVALID_VIEW_RECORD/);
  emit({kind:"surface.invoke",intent:{kind:"view.output",view:snapshot.resolved.view.id,output:"select",recordId:memberId}});
  await until(()=>model.snapshot().state.detail?.id===memberId);
  snapshot=model.snapshot(); assert.ok(snapshot.panel); assert.equal(snapshot.activeDestination,"media-collection");
  assert.equal(snapshot.resolved.top?.title,"Japan");
  bindViewEvents(snapshot.panel!.owner,model.event)({kind:"surface.invoke",intent:{kind:"close"}});
  snapshot=model.snapshot(); assert.equal(snapshot.panel,null);assert.equal(snapshot.state.detail?.id,collectionId);
  bindViewEvents(snapshot.resolved.owner,model.event)({kind:"surface.invoke",intent:{kind:"back"}});
  assert.equal(model.snapshot().activeDestination,"media");
  assert.equal(calls.some(method=>method==="prepare"||method==="accept"),false);
});

test("Add media opens the native picker first and initializes a transient draft with the current collection", async t => {
  let picked: FileNode | undefined;
  const selection={kind:'files.choose' as const,control:'image',files:[{id:'chosen',name:'photo.png',size:4,mediaType:'image/png',lastModified:0}]};
  const {model,calls}=await fixture(t,{resolve:()=>undefined,release:()=>{},pick:async node=>{picked=node;return selection;}});
  await openCollection(model);
  const snapshot=model.snapshot();
  bindViewEvents(snapshot.resolved.owner,model.event)({kind:'surface.invoke',intent:{kind:'view.output',view:snapshot.resolved.view.id,output:'import'}});
  assert.ok(picked,'the native picker is invoked by + without opening a form first');
  assert.equal(model.snapshot().panel,null);
  assert.deepEqual(picked.limits.accept,['image/jpeg','image/png','image/webp','video/mp4','audio/mp4','audio/mpeg','audio/wav']);
  await until(()=>model.snapshot().state.view==='create');
  assert.equal(model.snapshot().panel?.presentation,'transient');
  assert.equal(model.snapshot().activeDestination,'media-collection');
  assert.equal(model.snapshot().resolved.top?.title,'Japan');
  assert.deepEqual(model.snapshot().state.draft.collections,[collectionId]);
  assert.equal('title' in model.snapshot().state.draft,false);
  assert.equal(calls.some(method=>method==='prepare'||method==='accept'),false);
});

test("A pending native media choice cannot create a draft after navigation changes its origin",async t=>{
  let finish!: (value:Awaited<ReturnType<NonNullable<DraftFileHost['pick']>>>)=>void;
  const released:string[]=[];
  const {model,calls}=await fixture(t,{resolve:()=>undefined,release:id=>released.push(id),pick:()=>new Promise(resolve=>{finish=resolve;})});
  await openCollection(model);
  const snapshot=model.snapshot();
  bindViewEvents(snapshot.resolved.owner,model.event)({kind:'surface.invoke',intent:{kind:'view.output',view:snapshot.resolved.view.id,output:'import'}});
  model.navigate('media');
  finish({kind:'files.choose',control:'image',files:[{id:'stale',name:'photo.png',size:4,mediaType:'image/png',lastModified:0}]});
  await until(()=>released.length===1);
  assert.deepEqual(released,['stale']);
  assert.equal(model.snapshot().panel,null);
  assert.notEqual(model.snapshot().state.view,'create');
  assert.equal(calls.some(method=>method==='prepare'||method==='accept'),false);
});
