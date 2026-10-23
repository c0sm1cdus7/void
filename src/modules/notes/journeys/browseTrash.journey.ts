import { viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { TrashView } from "../views/trash.view.ts";
import { NoteDetailView } from "../views/noteDetail.view.ts";
import { ReadTrash } from "./readTrash.journey.ts";

export const ReadTrashExperience = {
  id: ReadTrash.id, kind: "read", view: TrashView, detailView: NoteDetailView,
  outputs: [
    { ...viewOutput(TrashView, "notes"), action: { kind: "back" } },
    { ...viewOutput(TrashView, "select"), action: { kind: "select" } },
    { ...viewOutput(NoteDetailView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
