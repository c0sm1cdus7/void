import { defineModule } from "desert-sdk/src/index.ts";
import { PrivateNotes } from "./note.object.ts";
import { PublishedNote } from "./note.publication.ts";
import { NotesController } from "./notes.dependencies.ts";
import { CreateNote, CreateNoteExperience } from "./journeys/createNote.journey.ts";
import { ReadNotes, ReadNotesExperience } from "./journeys/browseNotes.journey.ts";
import { EditNote, EditNoteExperience } from "./journeys/editNote.journey.ts";
import { NotesView } from "./views/notesHome.view.ts";
import { NoteEditorView } from "./views/noteEditor.view.ts";
import { NoteDetailView } from "./views/noteDetail.view.ts";
import { TrashView } from "./views/trash.view.ts";
import { ReadTrash } from "./journeys/readTrash.journey.ts";
import { ReadTrashExperience } from "./journeys/browseTrash.journey.ts";
import { TrashNote, TrashNoteExperience } from "./journeys/trashNote.journey.ts";
import { RestoreNote, RestoreNoteExperience } from "./journeys/restoreNote.journey.ts";
import { GuidedNote, GuidedNoteExperience } from "./journeys/guidedNote.journey.ts";
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
    { execution: CreateNote, presentation: CreateNoteExperience, label: "Create note", humanReview: "not-required" },
    { execution: ReadNotes, presentation: ReadNotesExperience, label: "Notes" },
    { execution: EditNote, presentation: EditNoteExperience, label: "Edit note", humanReview: "not-required" },
    { execution: ReadTrash, presentation: ReadTrashExperience, label: "Trash" },
    { execution: TrashNote, presentation: TrashNoteExperience, label: "Move to Trash", humanReview: "confirmation" },
    { execution: RestoreNote, presentation: RestoreNoteExperience, label: "Restore note", humanReview: "not-required" },
    { execution: GuidedNote, presentation: GuidedNoteExperience, label: "Guided note", humanReview: "required" },
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
