import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { tasks: "collection" }, outputs: ["create", "createProject", "select"] });

export const TasksView = defineView({
  name: "tasks", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actionGroup: "create", actions: [
    { output: Ports.output.create, label: "Create task", icon: "confirm" },
    { output: Ports.output.createProject, label: "Create project", icon: "catalog" },
  ] }),
  content: [
    Components.Header({ title: "Tasks", subtitle: "Your work, one task at a time." }),
    Components.Stack({ title: "All tasks", items: [
      Components.Collection({ input: Ports.inputs.tasks, output: Ports.output.select }),
    ] }),
  ],
});
