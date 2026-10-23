import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { draft: "form" }, outputs: ["close", "save"] });

export const TaskEditorView = defineView({
  name: "task-editor", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: "Save task", icon: "save" }] }),
  content: [
    Components.Header({ title: ViewTitles.operation, subtitle: "Describe the work and choose its projects." }),
    Components.Form({ input: Ports.inputs.draft }),
  ],
});
