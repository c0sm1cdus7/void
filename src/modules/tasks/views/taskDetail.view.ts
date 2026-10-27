import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { task: "context" }, outputs: ["close"] });

export const TaskDetailView = defineView({
  name: "task-detail", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: m.tasks.close, icon: "close" }] }),
  content: [
    Components.Header({ title: ViewTitles.subject, subtitle: m.tasks.detail.subtitle }),
    Components.Context({ input: Ports.inputs.task }),
  ],
});
