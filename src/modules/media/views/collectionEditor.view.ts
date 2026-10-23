import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";
const Ports = viewPorts({ inputs: { collection: "form" }, outputs: ["save", "close"] });
export const CollectionEditorView = defineView({ name: "collection-editor", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: "Save collection", icon: "save" }] }),
  content: [Components.Header({ title: ViewTitles.operation, subtitle: "Edit the name, cover and presentation of this collection." }), Components.Form({ input: Ports.inputs.collection })],
});
