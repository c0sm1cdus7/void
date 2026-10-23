import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";
const Ports = viewPorts({ inputs: { collection: "form" }, outputs: ["save", "close"] });
export const CollectionCreateView = defineView({ name: "collection-create", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: "Create collection", icon: "save" }] }),
  content: [Components.Header({ title: ViewTitles.operation, subtitle: "Gather related media in a named collection." }), Components.Form({ input: Ports.inputs.collection })],
});
