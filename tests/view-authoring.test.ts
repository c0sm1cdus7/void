import assert from "node:assert/strict";
import test from "node:test";
import { view, compile, compileViewProgram } from "desert-sdk/src/index.ts";
import { NotesView } from "../src/modules/notes/views/notesHome.view.ts";
import { VOID, VoidViewProgram, VoidProduct } from "../src/void.product.ts";

test("Notes authors a content sequence with an independent header and output", () => {
  const notes = VoidViewProgram.views.find(item => item.id === "notes")!;
  assert.equal(notes.id, "notes");
  assert.deepEqual(notes.content.map(item => item.kind), ["header", "stack", "stack"]);
  assert.deepEqual(notes.topDock?.actions.map(action => action.output), ["create"]);
  assert.deepEqual(notes.outputs, ["create", "select", "trash"]);
  assert.deepEqual(notes.content[2], { id: "content.2", kind: "stack", title: "Manage notes", items: [
    { id: "content.2.items.0", kind: "destination-link", output: "trash", label: "Trash", icon: "archive" },
  ] }, "Trash is an authored content destination, not a second toolbar action");
  assert.ok(Object.isFrozen(notes));
  assert.ok(Object.isFrozen(notes.content));
  assert.notEqual(notes, NotesView);
});

test("VOID opens Home, publishes capability destinations, and reuses one Notes create journey", () => {
  const surface = compile(VoidProduct).surface("human");
  assert.equal(surface.kind, "human");
  if (surface.kind !== "human") throw new Error("human required");
  const program = compileViewProgram(VoidViewProgram, surface);
  assert.equal(program.entry, "home");
  assert.deepEqual(program.navigation.map(item => item.destination), ["home", "notes", "tasks", "media", "system", "appearance", "identity", "visual-catalog"]);
  const creates = program.journeys.flatMap(journey => journey.outputs)
    .filter(binding => binding.action.kind === "journey" && binding.action.journey === "create-note");
  assert.equal(creates.length, 2);
  assert.equal(program.journeys.find(journey => journey.kind === "create")?.preferredDock, "right");
  assert.equal(program.views.length, 29);
  assert.equal(program.workspace, "workspace");
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
