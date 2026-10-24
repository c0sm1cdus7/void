import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { notes: "collection" }, outputs: ["notes", "select"] });

export const TrashView = defineView({
  name: "notes-trash", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.notes, label: m.notes.back, icon: "back" }] }),
  content: [
    Components.Header({ title: m.notes.trash.title, subtitle: m.notes.trash.subtitle }),
    Components.Stack({ title: m.notes.trash.deleted, items: [
      Components.Collection({ input: Ports.inputs.notes, output: Ports.output.select }),
    ] }),
  ],
});
