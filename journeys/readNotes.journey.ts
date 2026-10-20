import { readJourney } from "desert-sdk/src/index.ts";
import { NotesController } from "../dependencies.ts";
import { Note } from "../objects/note.ts";

export const ReadNotes = readJourney("read-notes", Note, {
  fields: ["title", "body"],
  collection: ["title"],
  requires: { controller: NotesController, dependencies: [] },
});
