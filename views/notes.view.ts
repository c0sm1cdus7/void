import { ViewVersion, type View } from "desert-sdk/src/index.ts";

/** The journey binds data and outputs; the View never executes an operation. */
export const NotesView = {
  version: ViewVersion,
  id: "notes",
  outputs: ["create", "select"],
  topDock: {
    kind: "toolbar",
    actions: [{ output: "create", label: "Create note", icon: "create" }],
  },
  content: [
    {
      kind: "header",
      id: "notes-header",
      title: "Notes",
      subtitle: "Your private notes.",
    },
    { kind: "stack", id: "all-notes", title: "All notes", items: [
      { kind: "collection", id: "notes", input: "notes", output: "select" },
    ] },
  ],
} satisfies View;
