import { defineModule } from "desert-sdk/src/index.ts";
import { PrivateNotes } from "./note.object.ts";
import { PublishedNote } from "./note.publication.ts";
import { NotesController } from "./notes.dependencies.ts";
import { CreateNote, CreateNoteJourney } from "./journeys/createNote.journey.ts";
import { ReadNotes, ReadNotesJourney } from "./journeys/browseNotes.journey.ts";
import { EditNote, EditNoteJourney } from "./journeys/editNote.journey.ts";
import { NotesView } from "./views/notesHome.view.ts";
import { NoteEditorView } from "./views/noteEditor.view.ts";
import { NoteDetailView } from "./views/noteDetail.view.ts";
import { TrashView } from "./views/trash.view.ts";
import { ReadTrash } from "./journeys/readTrash.journey.ts";
import { ReadTrashJourney } from "./journeys/browseTrash.journey.ts";
import { TrashNote, TrashNoteJourney } from "./journeys/trashNote.journey.ts";
import { RestoreNote, RestoreNoteJourney } from "./journeys/restoreNote.journey.ts";
import { GuidedNote, GuidedNoteJourney } from "./journeys/guidedNote.journey.ts";
import { NoteTitleView } from "./views/noteTitle.view.ts";
import { NoteBodyView } from "./views/noteBody.view.ts";
import { NoteReviewView } from "./views/noteReview.view.ts";
import { m } from "../../messages/keys.ts";

const NotesDestination = {
  id: "notes", label: m.notes.destination, icon: "create", entryJourney: ReadNotes,
} as const;
const TrashDestination = { id: "notes-trash", label: m.notes.trashDestination, icon: "archive", entryJourney: ReadTrash } as const;

export const NotesModule = defineModule({
  id: "notes",
  objects: [PublishedNote], dependencies: [NotesController], policies: [PrivateNotes],
  journeys: [
    { execution: CreateNote, presentation: CreateNoteJourney, label: m.notes.createNote, humanReview: "not-required" },
    { execution: ReadNotes, presentation: ReadNotesJourney, label: m.notes.readNotes },
    { execution: EditNote, presentation: EditNoteJourney, label: m.notes.editNote, humanReview: "not-required" },
    { execution: ReadTrash, presentation: ReadTrashJourney, label: m.notes.readTrash },
    { execution: TrashNote, presentation: TrashNoteJourney, label: m.notes.trashNote, humanReview: "confirmation" },
    { execution: RestoreNote, presentation: RestoreNoteJourney, label: m.notes.restoreNote, humanReview: "not-required" },
    { execution: GuidedNote, presentation: GuidedNoteJourney, label: m.notes.guidedNote, humanReview: "required" },
  ],
  views: [NotesView, NoteEditorView, NoteDetailView, TrashView, NoteTitleView, NoteBodyView, NoteReviewView],
  destinations: [NotesDestination, TrashDestination],
  exports: {
    journeys: { createNote: CreateNote, readNotes: ReadNotes, editNote: EditNote,
      readTrash: ReadTrash, trashNote: TrashNote, restoreNote: RestoreNote, guidedNote: GuidedNote },
    views: { Notes: NotesView, NoteEditor: NoteEditorView, NoteDetail: NoteDetailView, Trash: TrashView },
    destinations: { Notes: NotesDestination }, dependencies: { notes: NotesController },
  },
});
