import { ViewVersion, type View } from "desert-sdk/src/index.ts";

export const NoteDetailView = {
  version: ViewVersion, id: "note-detail", outputs: ["close"],
  topDock: { kind: "toolbar", actions: [{ output: "close", label: "Close", icon: "close" }] },
  content: [
    { kind: "header", id: "note-header", title: "Note", subtitle: "Saved in your local workspace." },
    { kind: "context", id: "note-context", input: "note" },
  ],
} satisfies View;
