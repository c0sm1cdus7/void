import { factReference, publishObject } from "desert-sdk/src/index.ts";
import { Note } from "./note.object.ts";
import { NoteDetailView } from "./views/noteDetail.view.ts";
import { EditNote } from "./journeys/editNote.journey.ts";
import { TrashNote } from "./journeys/trashNote.journey.ts";
import { RestoreNote } from "./journeys/restoreNote.journey.ts";

/** One object publication; presentation does not grant command authority. */
export const PublishedNote = publishObject(Note, {
  view: NoteDetailView,
  title: factReference(Note, "title"),
  fields: [
    { fact: factReference(Note, "title"), label: "Title", representation: "text" },
    { fact: factReference(Note, "body"), label: "Content", representation: "paragraphs" },
    { fact: factReference(Note, "state"), label: "Status", representation: "text" },
  ],
  actions: [
    { journey: EditNote, icon: "edit" },
    { journey: TrashNote, icon: "archive" },
    { journey: RestoreNote, icon: "restore" },
  ],
});
