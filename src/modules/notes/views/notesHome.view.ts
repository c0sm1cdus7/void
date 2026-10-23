import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { notes: "collection" }, outputs: ["create", "select", "trash"] });

/** The journey binds data and outputs; the View never executes an operation. */
export const NotesView = defineView({
  name: "notes",
  outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.create, label: "Create note", icon: "create" },
  ] }),
  content: [
    Components.Header({ title: "Notes", subtitle: "Your private notes." }),
    Components.Stack({ title: "All notes", items: [
      Components.Collection({ input: Ports.inputs.notes, output: Ports.output.select }),
    ] }),
    Components.Stack({ title: "Manage notes", items: [
      Components.DestinationLink({ output: Ports.output.trash, label: "Trash", icon: "archive" }),
    ] }),
  ],
});
