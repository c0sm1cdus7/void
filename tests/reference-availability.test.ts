import test from 'node:test';
import assert from 'node:assert/strict';
import { compile } from 'desert-sdk/src/index.ts';
import { humanState } from 'desert-sdk/src/web/client/state.ts';
import { modelReferences } from 'desert-sdk/src/web/client/model-references.ts';
import { readScopes } from 'desert-sdk/src/web/client/view-scopes.ts';
import type { ControllerTransport } from 'desert-sdk/src/web/client/transport.ts';
import type { HumanSurface, Prepared, RecordView } from 'desert-sdk/src/web/types.ts';
import { tasksTestProduct } from './support/tasks-host.ts';

function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }
function fixture(pause: 'begin' | 'prepare' | 'accept', hooks: {
  read?: () => Promise<RecordView[]>;
  beforeCall?: (method: string) => Promise<void>;
} = {}) {
  const product = tasksTestProduct(), application = compile(product), surface = application.surface('human') as HumanSurface;
  const scope = readScopes(product.viewProgram, surface).find(item => item.read.id === 'read-tasks')!;
  const store = humanState(surface, scope), journey = surface.journeys.find(item => item.id === 'create-project')!;
  assert.ok(journey.kind === 'mutation');
  const availability = { contractDigest: surface.contractDigest,
    journeys: Object.fromEntries(surface.journeys.map(item => [item.id, { dependenciesReady: true, blockers: [] }])) };
  const original = { title: 'Keep this writing', body: 'Details', projects: [] };
  store.update({ view: 'create', draft: original, availability });
  const prepared: Prepared = { id: '10000000-0000-4000-8000-000000000001', runId: '10000000-0000-4000-8000-000000000002', journeyId: journey.id,
    object: { id: '10000000-0000-4000-8000-000000000003', type: 'project', expectedVersion: 0 }, confirmationDigest: 'confirmation', facts: { name: 'Research', color: 'green' } };
  const receipt = { id: prepared.id, runId: prepared.runId, commandId: journey.commandId, status: 'completed' as const,
    object: { id: prepared.object.id, type: 'project', version: 1 } };
  const entered = deferred<void>(), release = deferred<void>(), records: RecordView[] = [], calls: { method: string; input: Record<string, unknown> }[] = [];
  let paused = false, accepted = false, active = true;
  const transport = { async evidence() { throw new Error('unused'); }, async call(method: string, input: Record<string, unknown>) {
    calls.push({ method, input });
    await hooks.beforeCall?.(method);
    if (method === pause && !paused) { paused = true; entered.resolve(); await release.promise; }
    if (method === 'begin') return { id: prepared.runId };
    if (method === 'prepare') return prepared;
    if (method === 'read') return hooks.read ? hooks.read() : records;
    if (method === 'accept') { accepted = true; records.push({ id: prepared.object.id, version: 1, facts: prepared.facts }); return receipt; }
    if (method === 'receipt') return accepted ? receipt : null;
    throw new Error(method);
  } } as ControllerTransport;
  const model = modelReferences(surface, store, transport, () => active, (id, input) => application.validateInput(id, input).valid, 'task');
  return { model, store, original, prepared, calls, entered, release,
    suspend() { store.update({ availability: { ...availability, journeys: Object.fromEntries(surface.journeys.map(item => [item.id, { dependenciesReady: false, blockers: [] }])) } }); model.invalidate(); },
    resume() { store.update({ availability }); },
    inactive() { active = false; },
    reactivate() { active = true; },
    close() { model.stop(); store.dispose(); } };
}

test('availability loss before companion begin completes releases its busy flag without inventing success', async () => {
  const f = fixture('begin');
  try {
    const creating = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    await f.entered.promise; assert.equal(f.store.get().busy, true);
    f.suspend(); f.suspend(); f.release.resolve(); await creating;
    assert.equal(f.store.get().busy, false, 'invalidated companion operations must not strand the host form busy');
    assert.deepEqual(f.store.get().draft, f.original);
    assert.equal(f.calls.some(call => call.method === 'prepare' || call.method === 'accept'), false);
    assert.ok(f.store.get().references?.['task.projects']?.error, 'a suspended create must not close as successful');
  } finally { f.close(); }
});

test('an unavailable companion create reports the reason without pretending success or starting work', async () => {
  const f = fixture('begin');
  try {
    f.suspend();
    await f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    assert.equal(f.store.get().busy, false);
    assert.equal(f.store.get().uncertain, false);
    assert.deepEqual(f.store.get().draft, f.original);
    assert.equal(f.calls.length, 0);
    assert.match(f.store.get().references?.['task.projects']?.error ?? '', /Creation is unavailable/);
    f.resume();
    const creating = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    await f.entered.promise; f.release.resolve(); await creating;
    assert.deepEqual(f.store.get().draft, { ...f.original, projects: [f.prepared.object.id] });
    assert.equal(f.store.get().busy, false);
    assert.equal(f.store.get().references?.['task.projects']?.error, undefined);
  } finally { f.release.resolve(); f.close(); }
});

test('a prepared intent arriving after invalidation is never accepted or hidden as recoverable work', async () => {
  const f = fixture('prepare');
  try {
    const creating = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    await f.entered.promise; f.suspend(); f.suspend(); f.release.resolve(); await creating;
    assert.equal(f.store.get().busy, false);
    assert.equal(f.store.get().uncertain, false);
    assert.deepEqual(f.store.get().draft, f.original);
    assert.ok(f.store.get().references?.['task.projects']?.error);
    f.resume(); await f.model.event({ kind: 'reference.recover', control: 'projects' });
    assert.equal(f.calls.some(call => call.method === 'accept'), false);
    assert.deepEqual(f.store.get().draft, f.original);
  } finally { f.close(); }
});

test('availability loss during companion acceptance preserves the exact recoverable intent', async () => {
  const f = fixture('accept');
  try {
    const creating = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    await f.entered.promise; f.suspend(); f.suspend(); f.release.resolve(); await creating;
    assert.equal(f.store.get().busy, false);
    assert.equal(f.store.get().uncertain, true);
    assert.equal(f.store.get().references?.['task.projects']?.uncertain, true, 'the recovery control stays visible');
    assert.deepEqual(f.store.get().draft, f.original);
    assert.equal(f.calls.filter(call => call.method === 'accept').length, 1);
    const beforeRecovery = f.calls.length;
    await f.model.event({ kind: 'reference.recover', control: 'projects' });
    assert.equal(f.calls.length, beforeRecovery, 'recovery cannot call the controller while unavailable');
    assert.equal(f.store.get().uncertain, true);
    assert.equal(f.store.get().references?.['task.projects']?.uncertain, true);
    assert.match(f.store.get().references?.['task.projects']?.error ?? '', /Creation is unavailable/);
    f.resume(); await f.model.event({ kind: 'reference.recover', control: 'projects' });
    assert.equal(f.store.get().busy, false); assert.equal(f.store.get().uncertain, false);
    assert.deepEqual(f.store.get().draft, { ...f.original, projects: [f.prepared.object.id] });
    assert.equal(f.calls.filter(call => call.method === 'prepare').length, 1);
    assert.equal(f.calls.filter(call => call.method === 'accept').length, 1, 'a successful acceptance is not replayed');
    assert.ok(f.calls.filter(call => ['accept', 'receipt'].includes(call.method)).every(call => call.input.intentId === f.prepared.id));
  } finally { f.close(); }
});

test('exact receipt recovery never attaches an accepted companion to a different draft', async () => {
  const f = fixture('accept');
  try {
    const creating = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    await f.entered.promise; f.suspend(); f.release.resolve(); await creating;
    assert.equal(f.store.get().uncertain, true);
    const newerDraft = { title: 'Different task', body: 'Keep this draft', projects: [] };
    f.store.update({ draft: newerDraft }); f.resume();
    await f.model.event({ kind: 'reference.recover', control: 'projects' });
    assert.deepEqual(f.store.get().draft, newerDraft);
    assert.equal(f.store.get().uncertain, false);
    assert.equal(f.store.get().busy, false);
    assert.match(f.store.get().references?.['task.projects']?.error ?? '', /Select it in the current draft/);
    assert.equal(f.calls.filter(call => call.method === 'accept').length, 1);
    assert.equal(f.calls.filter(call => call.method === 'prepare').length, 1);
    assert.deepEqual(f.calls.filter(call => call.method === 'receipt').map(call => call.input.intentId), [f.prepared.id]);
  } finally { f.close(); }
});

test('an inactive companion owner releases its own pending flag but cannot attach a late result to new writing', async () => {
  const f = fixture('prepare');
  try {
    const creating = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    await f.entered.promise; f.inactive();
    f.store.update({ view: 'list', draft: { title: 'New writing', body: 'New body', projects: [] } });
    f.release.resolve(); await creating;
    assert.equal(f.store.get().busy, false);
    assert.deepEqual(f.store.get().draft, { title: 'New writing', body: 'New body', projects: [] });
    assert.equal(f.calls.some(call => call.method === 'accept'), false);
    f.reactivate(); f.store.update({ view: 'create' });
    await f.model.event({ kind: 'reference.recover', control: 'projects' });
    assert.equal(f.calls.some(call => call.method === 'accept'), false, 'late prepare did not enter a hidden pending map');
    assert.deepEqual(f.store.get().draft, { title: 'New writing', body: 'New body', projects: [] });
  } finally { f.close(); }
});

test('an obsolete choices read cannot release or replace a newer in-flight read', async () => {
  const entered = [deferred<void>(), deferred<void>()], reads = [deferred<RecordView[]>(), deferred<RecordView[]>()];
  let count = 0;
  const f = fixture('prepare', { async read() {
    const index = count++; entered[index]?.resolve();
    assert.ok(reads[index], 'a refresh must reuse the current in-flight read');
    return reads[index]!.promise;
  } });
  const old = { id: '20000000-0000-4000-8000-000000000001', version: 1, facts: { name: 'Old choice', color: 'green' } };
  const current = { id: '20000000-0000-4000-8000-000000000002', version: 1, facts: { name: 'Current choice', color: 'blue' } };
  try {
    const first = f.model.event({ kind: 'reference.refresh', control: 'projects' });
    await entered[0]!.promise;
    f.suspend(); f.resume();
    const second = f.model.event({ kind: 'reference.refresh', control: 'projects' });
    await entered[1]!.promise;
    reads[0]!.resolve([old]); await first;
    assert.equal(f.store.get().references?.['task.projects']?.loading, true);
    assert.deepEqual(f.store.get().references?.['task.projects']?.options, []);
    const repeated = f.model.event({ kind: 'reference.refresh', control: 'projects' });
    await new Promise<void>(resolve => setImmediate(resolve));
    assert.equal(count, 2);
    reads[1]!.resolve([current]); await Promise.all([second, repeated]);
    assert.deepEqual(f.store.get().references?.['task.projects']?.options, [{ value: current.id, label: 'Current choice', color: 'blue' }]);
    assert.equal(f.store.get().references?.['task.projects']?.loading, false);
  } finally { reads.forEach(read => read.resolve([])); f.close(); }
});

test('a stale create completion cannot release a newer companion operation busy flag', async () => {
  const entered = deferred<void>(), release = deferred<void>();
  const f = fixture('begin', { async beforeCall(method) {
    if (method === 'prepare') { entered.resolve(); await release.promise; }
  } });
  try {
    const stale = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Old writing', color: 'green' });
    await f.entered.promise; f.suspend(); f.resume();
    const current = f.model.event({ kind: 'reference.create', control: 'projects', name: 'Research', color: 'green' });
    await entered.promise;
    f.release.resolve(); await stale;
    assert.equal(f.store.get().busy, true, 'only the current operation may release its busy flag');
    assert.equal(f.store.get().references?.['task.projects']?.busy, true);
    assert.deepEqual(f.store.get().draft, f.original);
    release.resolve(); await current;
    assert.equal(f.store.get().busy, false);
    assert.equal(f.calls.filter(call => call.method === 'accept').length, 1);
    assert.deepEqual(f.store.get().draft, { ...f.original, projects: [f.prepared.object.id] });
  } finally { f.release.resolve(); release.resolve(); f.close(); }
});
