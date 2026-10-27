import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../messages/keys.ts";

const Ports = viewPorts({ inputs: { tasks: "collection" }, outputs: ["create", "tasks"] });

export const HomeView = defineView({
  name: "home", layout: "overview", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.create, label: m.home.createNote, icon: "create" },
  ] }),
  content: [
    Components.Header({ title: ViewTitles.greeting }),
    Components.Attention(),
    Components.Stack({ title: m.home.widgets, items: [
      Components.Collection({ input: Ports.inputs.tasks, output: Ports.output.tasks,
        presentation:{kind:'summary-widget',title:m.home.tasks.title,description:m.home.tasks.description,totalLabel:m.home.tasks.total} }),
    ] }),
  ],
});
