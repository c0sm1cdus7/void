import assert from "node:assert/strict";
import test from "node:test";
import { openNotesTestHost } from "./support/notes-host.ts";

test("Trash and Restore preserve the private note and publish only the correct collection", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Trash owner");
  const human = host.controller.connect(owner.token, "human");
  const agent = host.controller.connect(owner.token, "agent");
  const initial = await human.prepare((await human.begin("create-note")).id, { title: "Keep me", body: "Recover this content." });
  const created = await human.accept(initial.id, initial.confirmationDigest);
  const id = created.object.id;
  const read = async (journey: string, subject?: string) => human.read((await human.begin(journey, subject)).id);
  assert.deepEqual((await read("read-notes")).map(note => note.id), [id]);
  assert.deepEqual(await read("read-trash"), []);
  assert.equal((await human.offer("trash-note", id)).eligible, true);
  assert.equal((await human.offer("restore-note", id)).eligible, false);
  const trash = await human.prepare((await human.begin("trash-note", id)).id, {});
  assert.deepEqual((await read("read-notes")).map(note => note.id), [id], "review preparation does not move the note");
  const trashed = await human.accept(trash.id, trash.confirmationDigest);
  assert.deepEqual(await human.accept(trash.id, trash.confirmationDigest), trashed);
  assert.deepEqual(await read("read-notes", id), []);
  assert.deepEqual(await read("read-notes"), []);
  assert.deepEqual(await read("read-trash", id), [{ id, version: 2,
    facts: { title: "Keep me", body: "Recover this content.", state: "trashed" } }]);
  assert.equal((await human.offer("edit-note", id)).eligible, false);
  assert.equal((await human.offer("trash-note", id)).eligible, false);
  assert.equal((await human.offer("restore-note", id)).eligible, true);
  await assert.rejects(async () => human.prepare((await human.begin("edit-note", id)).id,
    { title: "Wrong", body: "Wrong" }, { expectedVersion: 2 }), /PRECONDITION_FAILED/);
  const restored = await agent.prepare((await agent.begin("restore-note", id)).id, {});
  await agent.accept(restored.id, restored.confirmationDigest);
  assert.deepEqual(await read("read-trash"), []);
  assert.deepEqual(await read("read-notes", id), [{ id, version: 3, facts: { title: "Keep me", body: "Recover this content." } }]);
  const snapshot = await host.snapshot();
  assert.equal(snapshot.objects.length, 1, "Trash is not deletion or replacement");
  assert.equal(snapshot.receipts.length, 3, "reaccepting does not repeat the transition");
  assert.deepEqual(snapshot.objects[0]!.facts, { title: "Keep me", body: "Recover this content.", state: "active", owner: owner.id });
  await host.restart();
  const reopened = host.controller.connect(owner.token, "agent");
  assert.deepEqual(await reopened.read((await reopened.begin("read-notes", id)).id),
    [{ id, version: 3, facts: { title: "Keep me", body: "Recover this content." } }]);
});

test("Trash rejects foreign authority and stale prepared transitions without effects", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Trash concurrency owner");
  const session = host.controller.connect(owner.token, "human");
  const create = await session.prepare((await session.begin("create-note")).id, { title: "Original", body: "Private" });
  const { object: { id } } = await session.accept(create.id, create.confirmationDigest);
  const trash = await session.prepare((await session.begin("trash-note", id)).id, {});
  const edit = await session.prepare((await session.begin("edit-note", id)).id,
    { title: "Newer", body: "Private" }, { expectedVersion: 1 });
  await session.accept(edit.id, edit.confirmationDigest);
  await assert.rejects(session.accept(trash.id, trash.confirmationDigest), /VERSION_CONFLICT/);
  const before = await host.snapshot();
  const foreign = host.controller.connect((await host.controller.identities.issue("Other identity")).token, "agent");
  for (const journey of ["trash-note", "restore-note", "read-trash"]) {
    await assert.rejects(foreign.begin(journey, id), /NOT_FOUND/);
  }
  assert.deepEqual(await host.snapshot(), before);
});
