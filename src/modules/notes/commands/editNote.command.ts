import { fromInput, updateCommand } from "desert-sdk/src/index.ts";
import { Note } from "../note.object.ts";

/** Ownership and the editor's original revision remain enforced by the controller. */
export const EditNoteRecord = updateCommand("edit-note-record", Note, {
  input: ["title", "body"],
  when: { state: "active" },
  set: { title: fromInput("title"), body: fromInput("body") },
});
