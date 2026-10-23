import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { compile } from "desert-sdk/src/index.ts";
import { compile as compileContract } from "desert-sdk/src/compile.ts";
import { CreateNote } from "../src/modules/notes/journeys/createNote.journey.ts";
import { ReadNotes } from "../src/modules/notes/journeys/browseNotes.journey.ts";
import { EditNote } from "../src/modules/notes/journeys/editNote.journey.ts";
import { VoidHumanSurface } from "../src/surfaces.ts";
import { VOID, VoidProduct } from "../src/void.product.ts";

test("Notes, Tasks, projects and collections share canonical authority; only human sessions upload media", () => {
  const application = compile(VoidProduct);
  const expected = ["complete-task", "create-media-collection", "create-note", "create-project", "create-task",
    "edit-image", "edit-media-collection", "edit-note", "edit-task", "guided-note", "read-image-trash", "read-images",
    "read-media-collections", "read-notes", "read-projects", "read-tasks", "read-trash", "reopen-task", "restore-image",
    "restore-note", "set-media-collections", "trash-image", "trash-note"];
  for (const surface of ["human", "agent"]) {
    const actual = application.surface(surface).journeys.map(journey => journey.id).sort();
    assert.deepEqual(actual, surface === "human" ? [...expected, "import-image"].sort() : expected);
  }
  assert.equal(application.id, "void");
  assert.ok(VOID.journeys);
  assert.deepEqual(VOID.journeys.map(journey => journey.id).sort(), [...expected, "import-image"].sort());
});

test("the approved recovery manifest retains its historical identity and the current compiler rejects the legacy surface model", () => {
  const stableDigest = "fcf9e7012a443c276aac2c121e7a85d81a8ce31b88be60978a6d15743b628d1c";
  const baseline = JSON.parse(readFileSync(new URL("../releases/n1-stable.json", import.meta.url), "utf8"));
  assert.equal(baseline.build.contractDigest, stableDigest);
  assert.equal(baseline.sdk.commit, "46c1c04f33d7fa73e82e973f519baa2d58b69aa3");
  const human = VOID.surfaces?.find(surface => surface.kind === "human");
  assert.ok(human?.kind === "human");
  const { "edit-note": editCommit, ...commit } = human.commit;
  const { "edit-note": editLabel, ...journeys } = human.language.journeys;
  assert.equal(editCommit, "submit");
  assert.equal(editLabel, "Edit note");
  const prior = {
    ...VOID,
    journeys: VOID.journeys!.filter(journey => journey.id !== EditNote.id),
    surfaces: VOID.surfaces!.map(surface => {
      const exposed = surface.journeys.filter(id => id !== EditNote.id);
      if (surface.kind !== "human") return { ...surface, journeys: exposed };
      const { fieldRepresentations, ...rest } = surface;
      assert.ok(fieldRepresentations);
      return {
        ...rest, journeys: exposed, inputs: { "note.body": "input.multiline" },
        entry: ReadNotes.id, primaryAction: CreateNote.id, subjectActions: [],
        commit, language: { ...human.language, journeys },
      };
    }),
  };
  assert.throws(() => compileContract(prior), /Invalid definition/, "Legacy input maps are not silently reinterpreted");
  assert.notEqual(compile(VoidProduct).digest, stableDigest, "Do not silently repin the owner's existing installation");
});

test("VOID derives field presentation and human review without authored surface maps", () => {
  assert.deepEqual(Object.keys(VoidHumanSurface).sort(), ["id", "journeys", "kind", "locale"]);
  const human = VOID.surfaces?.find(surface => surface.kind === "human");
  assert.ok(human?.kind === "human");
  assert.deepEqual(human.fieldRepresentations, { "note.title": "text", "note.body": "paragraphs", "note.state": "text",
    "task.title": "text", "task.body": "paragraphs", "task.status": "text", "task.projects": "tags",
    "project.name": "text", "project.color": "text",
    "private-image.title": "text", "private-image.image": "image", "private-image.fit": "text",
    "private-image.description": "paragraphs", "private-image.collections": "tags", "private-image.state": "text",
    "media-collection.title": "text", "media-collection.layout": "text", "media-collection.cover": "tags" });
  assert.equal(Object.hasOwn(human, "inputs"), false);
  assert.deepEqual(human.language.fields, { "note.title": "Title", "note.body": "Content", "note.state": "Status",
    "task.title": "Title", "task.body": "Details", "task.status": "Status", "task.projects": "Projects",
    "project.name": "Name", "project.color": "Color",
    "private-image.title": "Title", "private-image.image": "Media file", "private-image.fit": "Thumbnail fit",
    "private-image.description": "Description", "private-image.collections": "Collections", "private-image.state": "Status",
    "media-collection.title": "Collection name", "media-collection.layout": "Presentation", "media-collection.cover": "Cover" });
  assert.deepEqual(human.commit, { "create-note": "submit", "edit-note": "submit", "trash-note": "confirm", "restore-note": "submit",
    "create-task": "submit", "edit-task": "submit", "complete-task": "submit", "reopen-task": "submit", "import-image": "submit",
    "create-project": "submit", "create-media-collection": "submit", "edit-media-collection": "submit",
    "set-media-collections": "submit", "edit-image": "submit", "trash-image": "confirm", "restore-image": "submit", "guided-note": "review" });
  assert.notEqual(compile(VoidProduct).digest, "feeb6b55a0e51875b81347c9619db2bc5b80fc71738e95ad0ca866a0b7060e56",
    "Trash adds canonical state and guarded commands; it cannot repin an old store");
  assert.notEqual(compile(VoidProduct).digest, "10e5f27ab77012fa4e42341fcd60f616792e8effd2d81cc4ccc7b45969861a1f",
    "Neutral field representation is an explicit contract evolution, not a store repin");
});

test("VOID navigation is owned only by its View program", () => {
  const human = compile(VoidProduct).surface(VoidHumanSurface.id);
  assert.equal(Object.hasOwn(human, "navigation"), false);
  for (const key of ["entry", "primaryAction", "subjectActions"]) {
    assert.equal(Object.hasOwn(VoidHumanSurface, key), false);
  }
});

test("the canonical input accepts present-empty title but not absent or fabricated fields", () => {
  const application = compile(VoidProduct);
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
