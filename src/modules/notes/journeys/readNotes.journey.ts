import { readJourney } from "desert-sdk/src/index.ts";
import { NotesController } from "../notes.dependencies.ts";
import { Note } from "../note.object.ts";

export const ReadNotes = readJourney("read-notes", Note, {
  fields: ["title", "body"], collection: ["title"],
  where: { state: "active" },
  requires: { controller: NotesController, dependencies: [] },
});
