import { mutationJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { RestoreNoteRecord } from "../commands/restoreNote.command.ts";
import { NotesController } from "../notes.dependencies.ts";
import { ReadTrash } from "./readTrash.journey.ts";

export const RestoreNote = mutationJourney("restore-note", RestoreNoteRecord, {
  controller: NotesController, dependencies: [],
});

export const RestoreNoteJourney = {
  id: RestoreNote.id, kind: "action", source: ReadTrash, outputs: [],
} satisfies ViewJourney;
