import assert from "node:assert/strict";
import test from "node:test";
import { CreateNote } from "../src/modules/notes/journeys/createNote.journey.ts";
import { ReadNotes } from "../src/modules/notes/journeys/browseNotes.journey.ts";
import { openNotesTestHost } from "./support/notes-host.ts";

test("another identity cannot enumerate or read a private note through either exposure", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("N0 private owner");
  const other = await host.controller.identities.issue("N0 other identity");
  const writer = host.controller.connect(owner.token, "human");
  const run = await writer.begin(CreateNote.id);
  const intent = await writer.prepare(run.id, { title: "Private", body: "Do not expose." });
  const receipt = await writer.accept(intent.id, intent.confirmationDigest);
  const before = await host.snapshot();
  for (const exposure of ["human", "agent"]) {
    const outsider = host.controller.connect(other.token, exposure);
    assert.deepEqual(await outsider.read((await outsider.begin(ReadNotes.id)).id), []);
    await assert.rejects(outsider.begin(ReadNotes.id, receipt.object.id), { message: "NOT_FOUND" });
    await assert.rejects(outsider.accept(intent.id, intent.confirmationDigest), { message: "NOT_FOUND" });
  }
  assert.deepEqual(await host.snapshot(), before);
});

test("revocation denies an already-admitted read and prepared acceptance without effects", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const identity = await host.controller.identities.issue("N0 revocable owner");
  const admitted = [];
  for (const exposure of ["human", "agent"]) {
    const session = host.controller.connect(identity.token, exposure);
    const read = await session.begin(ReadNotes.id);
    const run = await session.begin(CreateNote.id);
    const intent = await session.prepare(run.id, { title: "", body: "Must not be committed." });
    admitted.push({ session, read, intent });
  }
  await host.controller.identities.revoke(identity.id);
  for (const { session, read, intent } of admitted) {
    await assert.rejects(session.read(read.id), { message: "UNAUTHENTICATED" });
    await assert.rejects(session.begin(ReadNotes.id), { message: "UNAUTHENTICATED" });
    await assert.rejects(session.accept(intent.id, intent.confirmationDigest), { message: "UNAUTHENTICATED" });
  }
  assert.deepEqual(await host.snapshot(), { objects: [], receipts: [] });
});

test("human and agent sessions use the same create/read semantics, not an MCP transport", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const identity = await host.controller.identities.issue("N0 shared principal");
  const sessions = ["human", "agent"].map(surface => host.controller.connect(identity.token, surface));
  for (const [index, session] of sessions.entries()) {
    const run = await session.begin(CreateNote.id);
    const intent = await session.prepare(run.id, { title: "", body: `Session witness ${index}` });
    await session.accept(intent.id, intent.confirmationDigest);
  }
  const collections = await Promise.all(sessions.map(async session =>
    session.read((await session.begin(ReadNotes.id)).id)));
  assert.deepEqual(collections[0], collections[1]);
  assert.equal(collections[0]!.length, 2);
  for (const session of sessions) {
    for (const record of collections[0]!) {
      const details = await session.read((await session.begin(ReadNotes.id, record.id)).id);
      assert.equal(details[0]!.facts.title, "");
      assert.match(String(details[0]!.facts.body), /^Session witness [01]$/);
      assert.deepEqual(Object.keys(details[0]!.facts).sort(), ["body", "title"]);
    }
  }
  const snapshot = await host.snapshot();
  assert.equal(snapshot.receipts.length, 2);
  assert.ok(snapshot.objects.every(object => object.facts.owner === identity.id));
});
