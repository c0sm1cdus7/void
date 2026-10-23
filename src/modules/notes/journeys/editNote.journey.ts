import { factReference, initializeInput, mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { EditNoteRecord } from "../commands/editNote.command.ts";
import { Note } from "../note.object.ts";
import { NotesController } from "../notes.dependencies.ts";
import { NoteEditorView } from "../views/noteEditor.view.ts";
import { ReadNotes } from "./readNotes.journey.ts";

export const EditNote = mutationJourney("edit-note", EditNoteRecord, {
  controller: NotesController, dependencies: [],
});

export const EditNoteJourney = {
  id: EditNote.id, kind: "update", source: ReadNotes,
  view: NoteEditorView, preferredDock: "right",
  initialize: [
    initializeInput(EditNoteRecord, "title", factReference(Note, "title")),
    initializeInput(EditNoteRecord, "body", factReference(Note, "body")),
  ],
  outputs: [
    { ...viewOutput(NoteEditorView, "save"), action: { kind: "submit" } },
    { ...viewOutput(NoteEditorView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
