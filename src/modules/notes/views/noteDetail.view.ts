import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { note: "context" }, outputs: ["close"] });

export const NoteDetailView = defineView({
  name: "note-detail", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: m.notes.close, icon: "close" }] }),
  content: [
    Components.Header({ title: ViewTitles.subject, subtitle: m.notes.detail.subtitle }),
    Components.Context({ input: Ports.inputs.note }),
  ],
});
