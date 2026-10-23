import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { tasks: "collection" }, outputs: ["create", "tasks"] });

export const HomeView = defineView({
  name: "home", layout: "overview", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.create, label: "Create note", icon: "create" },
  ] }),
  content: [
    Components.Header({ title: ViewTitles.greeting }),
    Components.Attention(),
    Components.Stack({ title: "Widgets", items: [
      Components.Collection({ input: Ports.inputs.tasks, output: Ports.output.tasks,
        presentation:{kind:'summary-widget',title:'Tasks',description:'Your work at a glance.',totalLabel:'Tasks'} }),
    ] }),
  ],
});
