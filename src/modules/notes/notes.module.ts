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

const NotesDestination = {
  id: "notes", label: "Notes", icon: "create", entryJourney: ReadNotes,
} as const;
const TrashDestination = { id: "notes-trash", label: "Trash", icon: "archive", entryJourney: ReadTrash } as const;

export const NotesModule = defineModule({
  id: "notes",
  objects: [PublishedNote], dependencies: [NotesController], policies: [PrivateNotes],
  journeys: [
    { execution: CreateNote, presentation: CreateNoteJourney, label: "Create note", humanReview: "not-required" },
    { execution: ReadNotes, presentation: ReadNotesJourney, label: "Notes" },
    { execution: EditNote, presentation: EditNoteJourney, label: "Edit note", humanReview: "not-required" },
    { execution: ReadTrash, presentation: ReadTrashJourney, label: "Trash" },
    { execution: TrashNote, presentation: TrashNoteJourney, label: "Move to Trash", humanReview: "confirmation" },
    { execution: RestoreNote, presentation: RestoreNoteJourney, label: "Restore note", humanReview: "not-required" },
    { execution: GuidedNote, presentation: GuidedNoteJourney, label: "Guided note", humanReview: "required" },
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
