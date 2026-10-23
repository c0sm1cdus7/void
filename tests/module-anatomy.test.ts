import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));

test("VOID has one product root and capability-owned declarations, not parallel registries", () => {
  for (const path of [
    "src/void.product.ts", "src/navigation.ts", "src/exposures.ts", "src/modules.ts",
    "src/modules/notes/notes.module.ts", "src/modules/notes/note.object.ts",
    "src/modules/notes/note.publication.ts",
    "src/modules/notes/commands/createNote.command.ts",
    "src/modules/notes/commands/editNote.command.ts",
    "src/modules/notes/journeys/createNote.journey.ts",
    "src/modules/notes/journeys/browseNotes.journey.ts",
    "src/modules/notes/journeys/editNote.journey.ts",
    "src/modules/notes/views/notesHome.view.ts",
    "src/modules/notes/views/noteEditor.view.ts",
    "src/modules/notes/views/noteDetail.view.ts",
    "src/modules/tasks/tasks.module.ts", "src/modules/tasks/task.object.ts", "src/modules/tasks/task.publication.ts",
    "src/modules/tasks/commands/createTask.command.ts", "src/modules/tasks/commands/completeTask.command.ts",
    "src/modules/tasks/commands/reopenTask.command.ts", "src/modules/tasks/views/taskDetail.view.ts",
    "src/modules/system/system.module.ts", "src/modules/system/views/system.view.ts",
    "src/modules/identity/identity.module.ts", "src/modules/identity/views/identity.view.ts",
    "src/modules/identity/journeys/identity.journey.ts",
    "src/modules/media/media.module.ts", "src/modules/media/media.library.ts",
    "src/modules/media/views/media.view.ts", "src/modules/media/journeys/browseMedia.journey.ts",
    "src/modules/visualCatalog/visualCatalog.module.ts",
    "src/modules/visualCatalog/views/visualCatalog.view.ts",
    "src/modules/visualCatalog/journeys/browseVisualCatalog.journey.ts",
    "src/views/home.view.ts", "src/journeys/browseHome.journey.ts",
  ]) assert.equal(existsSync(join(root, path)), true, `Missing authored declaration: ${path}`);

  for (const path of ["product.ts", "experience.ts", "dependencies.ts", "objects", "views", "journeys", "commands"]) {
    assert.equal(existsSync(join(root, path)), false, `Legacy parallel authority: ${path}`);
  }
  assert.deepEqual(readdirSync(join(root, "src/modules")).sort(), ["appearance", "identity", "media", "notes", "system", "tasks", "visualCatalog"]);
});
