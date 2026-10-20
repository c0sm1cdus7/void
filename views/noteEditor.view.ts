import { ViewVersion, type View } from "desert-sdk/src/index.ts";

export const NoteEditorView = {
  version: ViewVersion, id: "note-editor", outputs: ["close", "save"],
  topDock: { kind: "toolbar", actions: [{ output: "close", label: "Close", icon: "close" }] },
  bottomDock: { kind: "toolbar", actions: [{ output: "save", label: "Save note", icon: "save" }] },
  content: [
    { kind: "header", id: "editor-header", title: "New note", subtitle: "Capture something worth keeping." },
    { kind: "form", id: "note-form", input: "draft" },
  ],
} satisfies View;
