import assert from "node:assert/strict";
import test from "node:test";
import { CreateNote } from "../journeys/createNote.journey.ts";
import { ReadNotes } from "../journeys/readNotes.journey.ts";
import { openNotesTestHost } from "./support/notes-host.ts";

test("an untitled note is written only on acceptance and projected without its owner", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const identity = await host.controller.identities.issue("N0 owner");
  const session = host.controller.connect(identity.token, "human");
  const run = await session.begin(CreateNote.id);
  const body = "Independent witness: keep this text exactly.\nSecond line.";
  const intent = await session.prepare(run.id, { title: "", body });
  assert.deepEqual(await host.snapshot(), { objects: [], receipts: [] });
  const receipt = await session.accept(intent.id, intent.confirmationDigest);
  const snapshot = await host.snapshot();
  assert.equal(snapshot.objects.length, 1);
  assert.deepEqual(snapshot.objects[0], {
    id: receipt.object.id, object_type: "note", version: 1,
    facts: { title: "", body, owner: identity.id },
  });
  assert.deepEqual(snapshot.receipts, [receipt]);
  const list = await session.read((await session.begin(ReadNotes.id)).id);
  assert.deepEqual(list, [{ id: receipt.object.id, version: 1, facts: { title: "" } }]);
  const detail = await session.read((await session.begin(ReadNotes.id, receipt.object.id)).id);
  assert.deepEqual(detail, [{ id: receipt.object.id, version: 1, facts: { title: "", body } }]);
  assert.deepEqual(await host.snapshot(), snapshot, "reads cannot create effects or receipts");
});

test("concurrent and subsequent acceptance of one intent returns one object and receipt", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const identity = await host.controller.identities.issue("N0 retry owner");
  const session = host.controller.connect(identity.token, "human");
  const run = await session.begin(CreateNote.id);
  const intent = await session.prepare(run.id, { title: "One occurrence", body: "One durable note." });
  const receipts = await Promise.all([
    session.accept(intent.id, intent.confirmationDigest),
    session.accept(intent.id, intent.confirmationDigest),
  ]);
  assert.deepEqual(receipts[0], receipts[1]);
  assert.deepEqual(await session.accept(intent.id, intent.confirmationDigest), receipts[0]);
  assert.deepEqual(await session.receipt(intent.id), receipts[0]);
  const snapshot = await host.snapshot();
  assert.equal(snapshot.objects.length, 1);
  assert.deepEqual(snapshot.receipts, [receipts[0]]);
});

test("controller and isolated PostgreSQL restart retain note and original operation receipt", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const identity = await host.controller.identities.issue("N0 durable owner");
  const session = host.controller.connect(identity.token, "human");
  const run = await session.begin(CreateNote.id);
  const intent = await session.prepare(run.id, { title: "", body: "Persist across restart." });
  const receipt = await session.accept(intent.id, intent.confirmationDigest);
  const before = await host.snapshot();
  await host.restart();
  const resumed = host.controller.connect(identity.token, "human");
  assert.deepEqual(await resumed.receipt(intent.id), receipt);
  assert.deepEqual(await resumed.accept(intent.id, intent.confirmationDigest), receipt);
  assert.deepEqual(await resumed.read((await resumed.begin(ReadNotes.id, receipt.object.id)).id), [
    { id: receipt.object.id, version: 1, facts: { title: "", body: "Persist across restart." } },
  ]);
  assert.deepEqual(await host.snapshot(), before);
});
