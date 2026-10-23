import { viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { NotesView } from "../views/notesHome.view.ts";
import { NoteDetailView } from "../views/noteDetail.view.ts";
import { CreateNote } from "./createNote.journey.ts";
import { ReadNotes } from "./readNotes.journey.ts";
import { ReadTrash } from "./readTrash.journey.ts";
export { ReadNotes } from "./readNotes.journey.ts";

export const ReadNotesJourney = {
  id: ReadNotes.id, kind: "read", view: NotesView, detailView: NoteDetailView,
  outputs: [
    { ...viewOutput(NotesView, "create"), action: { kind: "journey", journey: CreateNote } },
    { ...viewOutput(NotesView, "select"), action: { kind: "select" } },
    { ...viewOutput(NotesView, "trash"), action: { kind: "journey", journey: ReadTrash } },
    { ...viewOutput(NoteDetailView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
