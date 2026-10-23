import { literal, updateCommand } from "desert-sdk/src/index.ts";
import { Note } from "../note.object.ts";

export const TrashNoteRecord = updateCommand("trash-note-record", Note, {
  input: [],
  when: { state: "active" },
  set: { state: literal("trashed") },
});
