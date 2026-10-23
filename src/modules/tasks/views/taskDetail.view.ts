import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { task: "context" }, outputs: ["close"] });

export const TaskDetailView = defineView({
  name: "task-detail", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  content: [
    Components.Header({ title: ViewTitles.subject, subtitle: "Review details, projects and progress." }),
    Components.Context({ input: Ports.inputs.task }),
  ],
});
