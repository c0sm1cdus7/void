import { controllerRole } from "desert-sdk/src/index.ts";
import { Note } from "./objects/note.ts";

export const NotesController = controllerRole({
  id: "notes",
  objects: [Note],
  requires: [],
});
