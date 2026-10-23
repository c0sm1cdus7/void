import { mutationJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { TrashNoteRecord } from "../commands/trashNote.command.ts";
import { NotesController } from "../notes.dependencies.ts";
import { ReadNotes } from "./readNotes.journey.ts";

export const TrashNote = mutationJourney("trash-note", TrashNoteRecord, {
  controller: NotesController, dependencies: [],
});

export const TrashNoteExperience = {
  id: TrashNote.id, kind: "action", source: ReadNotes, outputs: [],
} satisfies ViewJourney;
