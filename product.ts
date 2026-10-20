import { product } from "desert-sdk/src/index.ts";
import { NotesController } from "./dependencies.ts";
import { CreateNote } from "./journeys/createNote.journey.ts";
import { ReadNotes } from "./journeys/readNotes.journey.ts";
import { Note, PrivateNotes } from "./objects/note.ts";
import { AgentNotes, HumanNotes } from "./surfaces.ts";

export const VOID = product({
  id: "void",
  objects: [Note],
  dependencies: [NotesController],
  policies: [PrivateNotes],
  journeys: [CreateNote, ReadNotes],
  surfaces: [HumanNotes, AgentNotes],
});
