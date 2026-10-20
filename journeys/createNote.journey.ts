import { mutationJourney } from "desert-sdk/src/index.ts";
import { CreateNoteRecord } from "../commands/createNote.command.ts";
import { NotesController } from "../dependencies.ts";

export const CreateNote = mutationJourney("create-note", CreateNoteRecord, {
  controller: NotesController,
  dependencies: [],
});
