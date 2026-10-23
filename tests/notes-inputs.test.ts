import assert from "node:assert/strict";
import test from "node:test";
import { CreateNote } from "../src/modules/notes/journeys/createNote.journey.ts";
import { openNotesTestHost } from "./support/notes-host.ts";

test("malformed input fails canonical preparation without a note or receipt", async t => {
  const host = await openNotesTestHost();
  t.after(() => host.close());
  const identity = await host.controller.identities.issue("N0 input owner");
  const malformed = [
    { body: "Missing title key is not coerced." },
    { title: "", body: null },
    { title: 7, body: "Invalid title type." },
    { title: "", body: "No owner injection.", owner: identity.id },
    { title: "", body: "No undeclared fields.", unknown: true },
  ];
  for (const exposure of ["human", "agent"]) {
    const session = host.controller.connect(identity.token, exposure);
    for (const input of malformed) {
      const run = await session.begin(CreateNote.id);
      await assert.rejects(session.prepare(run.id, input), { message: "INVALID_INPUT" });
      assert.deepEqual(await host.snapshot(), { objects: [], receipts: [] });
    }
  }
  const session = host.controller.connect(identity.token, "human");
  const valid = await session.begin(CreateNote.id);
  const intent = await session.prepare(valid.id, { title: "", body: "Valid positive control." });
  await session.accept(intent.id, intent.confirmationDigest);
  const snapshot = await host.snapshot();
  assert.equal(snapshot.objects.length, 1);
  assert.equal(snapshot.receipts.length, 1);
});
