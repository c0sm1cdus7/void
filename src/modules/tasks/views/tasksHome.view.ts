import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { tasks: "collection" }, outputs: ["create", "createProject", "select"] });

export const TasksView = defineView({
  name: "tasks", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actionGroup: "create", actions: [
    { output: Ports.output.create, label: m.tasks.createTask, icon: "confirm" },
    { output: Ports.output.createProject, label: m.tasks.createProject, icon: "catalog" },
  ] }),
  content: [
    Components.Header({ title: m.tasks.title, subtitle: m.tasks.subtitle }),
    Components.Stack({ title: m.tasks.all, items: [
      Components.Collection({ input: Ports.inputs.tasks, output: Ports.output.select }),
    ] }),
  ],
});
