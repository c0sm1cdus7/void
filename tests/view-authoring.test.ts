import assert from "node:assert/strict";
import test from "node:test";
import { view, compile, compileViewProgram } from "desert-sdk/src/index.ts";
import { NotesView } from "../views/notes.view.ts";
import { VoidViews } from "../views/index.ts";
import { VoidViewProgram } from "../experience.ts";
import { VOID } from "../product.ts";

test("Notes authors a content sequence with an independent header and output", () => {
  const notes = VoidViews.find(item => item.id === "notes")!;
  assert.equal(notes.id, "notes");
  assert.deepEqual(notes.content.map(item => item.kind), ["header", "stack"]);
  assert.equal(notes.topDock?.actions[0]?.output, "create");
  assert.deepEqual(notes.outputs, ["create", "select"]);
  assert.ok(Object.isFrozen(notes));
  assert.ok(Object.isFrozen(notes.content));
  assert.notEqual(notes, NotesView);
});

test("VOID opens Home, publishes Notes and the catalog, and reuses one create journey", () => {
  const surface = compile(VOID).surface("human");
  assert.equal(surface.kind, "human");
  if (surface.kind !== "human") throw new Error("human required");
  const program = compileViewProgram(VoidViewProgram, surface);
  assert.equal(program.entry, "home");
  assert.deepEqual(program.navigation, ["home", "notes", "visual-catalog"]);
  const creates = program.journeys.flatMap(journey => journey.outputs)
    .filter(binding => binding.action.kind === "journey" && binding.action.journey === "create-note");
  assert.equal(creates.length, 2);
  assert.equal(program.journeys.find(journey => journey.kind === "create")?.preferredDock, "right");
  assert.equal(program.views.length, 5);
});

test("Notes cannot add private styling or execute a journey through its View", () => {
  assert.throws(() => view({ ...NotesView, style: { padding: 12 } }), /INVALID_VIEW/);
  assert.throws(() => view({
    ...NotesView,
    topDock: {
      ...NotesView.topDock,
      actions: [{ ...NotesView.topDock.actions[0], journey: "create-note" }],
    },
  }), /INVALID_VIEW/);
});
