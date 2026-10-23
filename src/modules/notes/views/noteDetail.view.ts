import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { note: "context" }, outputs: ["close"] });

export const NoteDetailView = defineView({
  name: "note-detail", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  content: [
    Components.Header({ title: ViewTitles.subject, subtitle: "Read and edit your note." }),
    Components.Context({ input: Ports.inputs.note }),
  ],
});
