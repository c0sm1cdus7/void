import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { draft: "form" }, outputs: ["close", "save"] });

export const NoteEditorView = defineView({
  name: "note-editor", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: m.notes.close, icon: "close" }] }),
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: m.notes.saveNote, icon: "save" }] }),
  content: [
    Components.Header({ title: ViewTitles.operation, subtitle: m.notes.editor.subtitle }),
    Components.Form({ input: Ports.inputs.draft }),
  ],
});
