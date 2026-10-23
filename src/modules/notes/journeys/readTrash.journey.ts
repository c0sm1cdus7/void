import { readJourney } from "desert-sdk/src/index.ts";
import { NotesController } from "../notes.dependencies.ts";
import { Note } from "../note.object.ts";

export const ReadTrash = readJourney("read-trash", Note, {
  fields: ["title", "body", "state"], collection: ["title"],
  where: { state: "trashed" },
  requires: { controller: NotesController, dependencies: [] },
});
