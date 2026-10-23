import { mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { CreateNoteRecord } from "../commands/createNote.command.ts";
import { NotesController } from "../notes.dependencies.ts";
import { NoteEditorView } from "../views/noteEditor.view.ts";
import { ReadNotes } from "./readNotes.journey.ts";

export const CreateNote = mutationJourney("create-note", CreateNoteRecord, {
  controller: NotesController,
  dependencies: [],
});

export const CreateNoteExperience = {
  id: CreateNote.id, kind: "create", source: ReadNotes, view: NoteEditorView, preferredDock: "right",
  outputs: [
    { ...viewOutput(NoteEditorView, "save"), action: { kind: "submit" } },
    { ...viewOutput(NoteEditorView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
