import assert from "node:assert/strict";
import test from "node:test";
import { compile } from "desert-sdk/src/index.ts";
import { CreateNote } from "../journeys/createNote.journey.ts";
import { ReadNotes } from "../journeys/readNotes.journey.ts";
import { VOID } from "../product.ts";

test("N0 exposes only the same create/read journeys to human and agent sessions", () => {
  const application = compile(VOID);
  const expected = [CreateNote.id, ReadNotes.id].sort();
  assert.deepEqual(expected, ["create-note", "read-notes"]);
  for (const surface of ["human", "agent"]) {
    const actual = application.surface(surface).journeys.map(journey => journey.id).sort();
    assert.deepEqual(actual, expected);
  }
  assert.equal(application.id, "void");
  assert.deepEqual(VOID.journeys.map(journey => journey.id).sort(), expected);
});

test("the canonical input accepts present-empty title but not absent or fabricated fields", () => {
  const application = compile(VOID);
  const command = CreateNote.command.id;
  assert.equal(application.validateInput(command, { title: "", body: "A real note." }).valid, true);
  for (const input of [
    { body: "A real note." },
    { title: null, body: "A real note." },
    { title: "", body: 42 },
    { title: "", body: "A real note.", owner: "supplied-by-client" },
    { title: "", body: "A real note.", style: { color: "red" } },
  ]) {
    assert.equal(application.validateInput(command, input).valid, false);
  }
});
