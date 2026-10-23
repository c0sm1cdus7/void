import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { notes: "collection" }, outputs: ["notes", "select"] });

export const TrashView = defineView({
  name: "notes-trash", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.notes, label: "Back", icon: "back" }] }),
  content: [
    Components.Header({ title: "Trash", subtitle: "Your notes stay here until you restore them." }),
    Components.Stack({ title: "Deleted notes", items: [
      Components.Collection({ input: Ports.inputs.notes, output: Ports.output.select }),
    ] }),
  ],
});
