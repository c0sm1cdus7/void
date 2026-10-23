import assert from "node:assert/strict";
import test from "node:test";
import { agentExposure, compile, composeProduct, Components, defineView, humanExposure, moduleIndex,
  type ViewDestination, type ViewJourney } from "desert-sdk/src/index.ts";
import { NotesModule } from "../src/modules/notes/notes.module.ts";
import { Commands, Journeys, Modules, Views } from "../src/modules.ts";
import { VoidProduct } from "../src/void.product.ts";
import { WorkspaceView } from "../src/views/workspace.view.ts";
import { NavigationView } from "../src/views/navigation.view.ts";

test("one composition derives the exact current capability and visual inventories", () => {
  assert.deepEqual(VoidProduct.catalog.modules, ["notes", "tasks", "media", "system", "appearance", "identity", "visual-catalog"]);
  assert.deepEqual(VoidProduct.viewProgram.views.map(item => item.id).sort(),
    ["appearance", "collection-editor", "edit-image", "home", "identity", "image-trash", "import-image",
      "media-collection-detail", "media-collections", "media-overview", "navigation", "note-body", "note-detail", "note-editor",
      "note-review", "note-title", "notes", "notes-trash", "private-image-detail", "private-images", "project-detail", "project-editor", "projects",
      "system", "task-detail", "task-editor", "tasks", "visual-catalog", "workspace"]);
  assert.equal(VoidProduct.viewProgram.workspace, WorkspaceView.id);
  assert.deepEqual(VoidProduct.viewProgram.views.find(view => view.id === WorkspaceView.id)?.leftDock,
    { kind: "view", view: NavigationView.id });
  assert.deepEqual(VoidProduct.viewProgram.journeys.map(item => item.id).sort(),
    ["adjust-appearance", "complete-task", "create-note", "create-project", "create-task", "edit-image", "edit-media-collection", "edit-note", "edit-task",
      "guided-note", "home", "import-image", "inspect-identity", "inspect-system", "media-library", "read-image-trash", "read-images",
      "read-media-collections", "read-notes", "read-projects", "read-tasks", "read-trash", "reopen-task", "restore-image", "restore-note",
      "trash-image", "trash-note", "visual-catalog"]);
  assert.deepEqual(VoidProduct.catalog.commands, [
    { id: "create-note-record", owner: "notes", journeys: ["create-note", "guided-note"] },
    { id: "edit-note-record", owner: "notes", journeys: ["edit-note"] },
    { id: "trash-note-record", owner: "notes", journeys: ["trash-note"] },
    { id: "restore-note-record", owner: "notes", journeys: ["restore-note"] },
    { id: "create-project-record", owner: "tasks", journeys: ["create-project"] },
    { id: "create-task-record", owner: "tasks", journeys: ["create-task"] },
    { id: "edit-task-record", owner: "tasks", journeys: ["edit-task"] },
    { id: "complete-task-record", owner: "tasks", journeys: ["complete-task"] },
    { id: "reopen-task-record", owner: "tasks", journeys: ["reopen-task"] },
    { id: "create-media-collection-record", owner: "media", journeys: ["create-media-collection"] },
    { id: "edit-media-collection-record", owner: "media", journeys: ["edit-media-collection"] },
    { id: "set-media-collections-record", owner: "media", journeys: ["set-media-collections"] },
    { id: "import-image-record", owner: "media", journeys: ["import-image"] },
    { id: "edit-image-record", owner: "media", journeys: ["edit-image"] },
    { id: "trash-image-record", owner: "media", journeys: ["trash-image"] },
    { id: "restore-image-record", owner: "media", journeys: ["restore-image"] },
  ]);
  assert.ok(Object.isFrozen(VoidProduct));
  assert.ok(Object.isFrozen(VoidProduct.viewProgram.views));
});

test("the storyboard follows authored destinations and shares the same create activity", () => {
  assert.equal(VoidProduct.storyboard.entry, "home");
  assert.deepEqual(VoidProduct.storyboard.navigation, [
    { destination: "home", group: "Explore", purpose: "content" },
    { destination: "notes", group: "Explore", purpose: "content" },
    { destination: "tasks", group: "Explore", purpose: "content" },
    { destination: "media", group: "Explore", purpose: "content" },
    { destination: "system", group: "Settings", purpose: "utility" },
    { destination: "appearance", group: "Settings", purpose: "utility" },
    { destination: "identity", group: "Settings", purpose: "utility" },
    { destination: "visual-catalog", group: "Developer", purpose: "utility" },
  ]);
  const starts = VoidProduct.storyboard.journeys
    .filter(item => item.outputs.some(output =>
      output.action.kind === "journey" && output.action.journey === "create-note"))
    .map(item => item.id).sort();
  assert.deepEqual(starts, ["home", "read-notes"]);
  assert.deepEqual(VoidProduct.storyboard.journeys.find(item => item.id === "read-notes")?.starts, ["notes"]);
  assert.equal(VoidProduct.storyboard.journeys.filter(item => item.id === "create-note").length, 1);
  assert.deepEqual(VoidProduct.storyboard.journeys.find(item => item.id === "create-note")?.exposedOn,
    ["human", "agent"]);
});

test("the storyboard shows Note detail to Edit from the object's one published action list", () => {
  const read = VoidProduct.storyboard.journeys.find(item => item.id === "read-notes")!;
  const edit = VoidProduct.storyboard.journeys.find(item => item.id === "edit-note")!;
  assert.deepEqual(read.subjectActions, [
    { object: "note", view: "note-detail", journey: "edit-note", icon: "edit" },
    { object: "note", view: "note-detail", journey: "trash-note", icon: "archive" },
  ]);
  assert.deepEqual(VoidProduct.storyboard.journeys.find(item => item.id === "read-trash")?.subjectActions,
    [{ object: "note", view: "note-detail", journey: "restore-note", icon: "restore" }]);
  assert.deepEqual(read.starts, ["notes"]);
  assert.deepEqual(edit.starts, [], "Editing an existing object is not a navigation destination");
  assert.equal(edit.source, "read-notes");
});

test("Notes mounts without Home or Visual catalog when its host provides a real activity resume destination", () => {
  const modules = moduleIndex([NotesModule]);
  const journeys = Object.values(modules.journeys);
  const base = {
    id: "void", label: "VOID", modules,
    views: [WorkspaceView, NavigationView] as const, workspace: WorkspaceView,
    exposures: [humanExposure({ id: "human", journeys, locale: "en" }), agentExposure("agent", journeys)],
    entry: modules.destinations.Notes,
    navigation: [{ destination: modules.destinations.Notes, group: "Explore", purpose: "content" }] as const,
  };
  assert.throws(() => composeProduct(base), /UNREACHABLE_PROGRAM_JOURNEY/,
    "An exposed guided activity cannot be stranded after removing its obsolete creation shortcut");
  const ResumeView = defineView({ name: "resume-notes", outputs: [], content: [
    Components.Header({ title: "Needs your attention" }), Components.Attention(),
  ] });
  const ResumeJourney = { id: "resume-notes", kind: "presentation", view: ResumeView, outputs: [] } satisfies ViewJourney;
  const ResumeDestination = { id: "resume-notes", label: "Needs your attention", icon: "open", entryJourney: ResumeJourney } satisfies ViewDestination;
  const notes = composeProduct({ ...base, views: [...base.views, ResumeView] as const,
    journeys: [{ presentation: ResumeJourney }], destinations: [ResumeDestination],
    navigation: [...base.navigation, { destination: ResumeDestination, group: "Explore", purpose: "content" }] as const,
  });
  assert.deepEqual(notes.viewProgram.destinations.map(item => item.id), ["notes", "notes-trash", "resume-notes"]);
  assert.equal(notes.viewProgram.views.some(view => view.id === "home" || view.id === "visual-catalog"), false);
  assert.equal(notes.storyboard.journeys.some(journey => journey.outputs.some(output =>
    output.action.kind === "journey" && output.action.journey === "guided-note")), false,
  "Attention only resumes existing activities; it does not create another Guided Note entry");
  assert.deepEqual(compile(notes).surface("human").journeys.map(journey => journey.id).sort(),
    ["create-note", "edit-note", "guided-note", "read-notes", "read-trash", "restore-note", "trash-note"]);
  assert.deepEqual(notes.definition.objects, VoidProduct.definition.objects.filter(object => object.id === "note"));
});

test("Note owns its presentation and publishes commands through actual admitted journeys", () => {
  assert.deepEqual(VoidProduct.viewProgram.objects?.filter(object => object.object === "note"), [{
    object: "note", view: "note-detail", title: { object: "note", field: "title" },
    actions: [{ journey: "edit-note", icon: "edit" }, { journey: "trash-note", icon: "archive" },
      { journey: "restore-note", icon: "restore" }],
  }]);
  const edit = VoidProduct.viewProgram.journeys.find(journey => journey.id === "edit-note");
  assert.equal(edit?.kind, "update");
  if (edit?.kind !== "update") throw new Error("Expected an update journey");
  assert.equal(edit.source, "read-notes");
  assert.deepEqual(edit.initialize, [{ input: "title", fact: "title" }, { input: "body", fact: "body" }]);
});

test("explicit published handles do not expose private object or journey implementations", () => {
  assert.equal(Commands.createNote.id, "create-note-record");
  assert.deepEqual(Object.keys(Journeys).sort(), ["completeTask", "createCollection", "createNote", "createProject", "createTask",
    "editCollection", "editImage", "editNote", "editTask", "guidedNote", "importImage", "readCollections", "readImageTrash", "readImages",
    "readNotes", "readProjects", "readTasks", "readTrash", "reopenTask", "restoreImage", "restoreNote", "setMediaCollections", "trashImage", "trashNote"]);
  assert.deepEqual(Object.keys(Modules.objects), ["Task"]);
  assert.deepEqual(Modules.objects.Task, { kind: "object", owner: "tasks", id: "task" });
  assert.equal(Object.hasOwn(Modules.objects.Task, "fields"), false);
  assert.equal(Object.hasOwn(Modules.objects, "Note"), false);
  assert.equal(Object.hasOwn(Journeys.createNote, "execution"), false);
  assert.equal(Object.hasOwn(Commands.createNote, "effects"), false);
});

test("modules publish typed reusable views without exposing their implementation files", () => {
  assert.deepEqual(Views.Notes, { kind: "view", owner: "notes", id: "notes" });
  assert.deepEqual(Views.NoteEditor, { kind: "view", owner: "notes", id: "note-editor" });
  assert.deepEqual(Views.NoteDetail, { kind: "view", owner: "notes", id: "note-detail" });
  assert.deepEqual(Views.VisualCatalog,
    { kind: "view", owner: "visual-catalog", id: "visual-catalog" });
  assert.deepEqual(Views.Media, { kind: "view", owner: "media", id: "media-overview" });
  assert.deepEqual(Views.Tasks, { kind: "view", owner: "tasks", id: "tasks" });
  // @ts-expect-error A journey alias is not an exported View alias.
  assert.equal(Views.createNote, undefined);
});
