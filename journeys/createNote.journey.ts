import { mutationJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { CreateNoteRecord } from "../commands/createNote.command.ts";
import { NotesController } from "../dependencies.ts";
import { NoteEditorView } from "../views/noteEditor.view.ts";

export const CreateNote = mutationJourney("create-note", CreateNoteRecord, {
  controller: NotesController,
  dependencies: [],
});

export const CreateNoteExperience = {
  id: CreateNote.id, kind: "create", view: NoteEditorView.id, preferredDock: "right",
  outputs: [
    { view: NoteEditorView.id, output: "save", action: { kind: "submit" } },
    { view: NoteEditorView.id, output: "close", action: { kind: "close" } },
  ],
} satisfies ViewJourney;
