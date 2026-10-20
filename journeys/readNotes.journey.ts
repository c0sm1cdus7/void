import { readJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { NotesController } from "../dependencies.ts";
import { Note } from "../objects/note.ts";
import { NotesView } from "../views/notes.view.ts";
import { NoteDetailView } from "../views/noteDetail.view.ts";
import { CreateNote } from "./createNote.journey.ts";

export const ReadNotes = readJourney("read-notes", Note, {
  fields: ["title", "body"],
  collection: ["title"],
  requires: { controller: NotesController, dependencies: [] },
});

export const ReadNotesExperience = {
  id: ReadNotes.id, kind: "read", view: NotesView.id, detailView: NoteDetailView.id,
  outputs: [
    { view: NotesView.id, output: "create", action: { kind: "journey", journey: CreateNote.id } },
    { view: NotesView.id, output: "select", action: { kind: "select" } },
    { view: NoteDetailView.id, output: "close", action: { kind: "close" } },
  ],
} satisfies ViewJourney;
