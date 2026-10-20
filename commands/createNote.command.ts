import { actorId, createCommand, fromInput } from "desert-sdk/src/index.ts";
import { Note } from "../objects/note.ts";

export const CreateNoteRecord = createCommand("create-note-record", Note, {
  input: ["title", "body"],
  values: {
    title: fromInput("title"),
    body: fromInput("body"),
    owner: actorId(),
  },
});
