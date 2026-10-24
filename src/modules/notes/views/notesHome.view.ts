import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { notes: "collection" }, outputs: ["create", "select", "trash"] });

/** The journey binds data and outputs; the View never executes an operation. */
export const NotesView = defineView({
  name: "notes",
  outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.create, label: m.notes.createNote, icon: "create" },
  ] }),
  content: [
    Components.Header({ title: m.notes.title, subtitle: m.notes.subtitle }),
    Components.Stack({ title: m.notes.all, items: [
      Components.Collection({ input: Ports.inputs.notes, output: Ports.output.select }),
    ] }),
    Components.Stack({ title: m.notes.manage, items: [
      Components.DestinationLink({ output: Ports.output.trash, label: m.notes.trashLink, icon: "archive" }),
    ] }),
  ],
});
