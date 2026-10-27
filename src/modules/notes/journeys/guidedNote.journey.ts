import { activityExperience, activityInputs, mutationJourney } from "desert-sdk/src/index.ts";
import { CreateNoteRecord } from "../commands/createNote.command.ts";
import { NotesController } from "../notes.dependencies.ts";
import { NoteTitleView } from "../views/noteTitle.view.ts";
import { NoteBodyView } from "../views/noteBody.view.ts";
import { NoteReviewView } from "../views/noteReview.view.ts";
import { ReadNotes } from "./readNotes.journey.ts";

export const GuidedNote = mutationJourney("guided-note", CreateNoteRecord, {
  controller: NotesController, dependencies: [],
});
const Inputs = activityInputs(GuidedNote);

export const GuidedNoteJourney = activityExperience({
  journey: GuidedNote,
  steps: [
    { view: NoteTitleView, inputs: [Inputs.title] },
    { view: NoteBodyView, inputs: [Inputs.body] },
  ],
  review: NoteReviewView,
}, ReadNotes);
