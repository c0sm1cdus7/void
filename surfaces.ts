import { agentSurface, humanSurface } from "desert-sdk/src/index.ts";
import { CreateNote } from "./journeys/createNote.journey.ts";
import { ReadNotes } from "./journeys/readNotes.journey.ts";

export const HumanNotes = humanSurface({
  id: "human",
  journeys: [CreateNote, ReadNotes],
  entry: ReadNotes,
  primaryAction: CreateNote,
  subjectActions: [],
  inputs: { "note.body": "input.multiline" },
  commit: { "create-note": "submit" },
  language: {
    locale: "en",
    fields: { "note.title": "Title", "note.body": "Content" },
    journeys: { "create-note": "Create note", "read-notes": "Notes" },
  },
  connection: {
    availability: "journey-dependencies",
    draftRetention: "session-memory",
    reconnect: "refresh-without-replay",
  },
});

export const AgentNotes = agentSurface("agent", [CreateNote, ReadNotes]);
