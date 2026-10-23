import { literal, updateCommand } from "desert-sdk/src/index.ts";
import { Note } from "../note.object.ts";

export const RestoreNoteRecord = updateCommand("restore-note-record", Note, {
  input: [],
  when: { state: "trashed" },
  set: { state: literal("active") },
});
