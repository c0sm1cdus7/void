import assert from "node:assert/strict";
import test from "node:test";
import { compile } from "desert-sdk/src/index.ts";
import { VOID, VoidProduct } from "../src/void.product.ts";
import { openNotesTestHost } from "./support/notes-host.ts";

test("Notes publishes the same edit operation to human and agent sessions", () => {
  const application = compile(VoidProduct);
  for (const id of ["human", "agent"]) {
    const edit = application.surface(id).journeys.find(journey => journey.id === "edit-note");
    assert.ok(edit, `${id} must expose the actual canonical edit journey`);
    assert.equal(edit.kind, "mutation");
  }
});

test("edits preserve identity, require the original revision and cannot overwrite another edit", async t => {
  assert.ok(VOID.journeys?.some(journey => journey.id === "edit-note"), "the product must install editing");
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Editing witness");
  const human = host.controller.connect(owner.token, "human");
  const agent = host.controller.connect(owner.token, "agent");
  const create = await human.begin("create-note");
  const initial = await human.prepare(create.id, { title: "Original", body: "First body" });
  const created = await human.accept(initial.id, initial.confirmationDigest);
  const id = created.object.id;
  const before = (await human.read((await human.begin("read-notes", id)).id))[0]!;
  assert.equal(before.version, 1);
  const edit = await agent.begin("edit-note", id);
  await assert.rejects(() => agent.prepare(edit.id, { title: "Edited", body: "Second body" }), /EDIT_BASE_REQUIRED/);
  const intent = await agent.prepare(edit.id, { title: "Edited", body: "Second body" }, { expectedVersion: before.version });
  assert.equal((await host.snapshot()).objects[0]!.version, 1, "preparing is not writing");
  const accepted = await agent.accept(intent.id, intent.confirmationDigest);
  assert.equal(accepted.object.id, id);
  assert.deepEqual(await agent.accept(intent.id, intent.confirmationDigest), accepted);
  const stale = await human.begin("edit-note", id);
  await assert.rejects(() => human.prepare(stale.id, { title: "Stale", body: "Wrong" },
    { expectedVersion: before.version }), /VERSION_CONFLICT/);
  const after = (await human.read((await human.begin("read-notes", id)).id))[0]!;
  assert.deepEqual(after, { id, version: 2, facts: { title: "Edited", body: "Second body" } });
  const snapshot = await host.snapshot();
  assert.equal(snapshot.objects.length, 1);
  assert.equal(snapshot.receipts.length, 2);
  assert.equal(snapshot.objects[0]!.facts.owner, owner.id);
  const outsider = await host.controller.identities.issue("Other identity");
  const foreign = host.controller.connect(outsider.token, "agent");
  await assert.rejects(async () => {
    const attempt = await foreign.begin("edit-note", id);
    await foreign.prepare(attempt.id, { title: "Wrong", body: "Wrong" }, { expectedVersion: 2 });
  });
  assert.deepEqual(await host.snapshot(), snapshot, "denied edits cannot mutate any data or receipt");
});
