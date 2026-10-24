import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";
const Ports = viewPorts({ inputs: { collection: "form" }, outputs: ["save", "close"] });
export const CollectionEditorView = defineView({ name: "collection-editor", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: m.media.close, icon: "close" }] }),
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: m.media.saveCollection, icon: "save" }] }),
  content: [Components.Header({ title: ViewTitles.operation, subtitle: m.media.collection.editorSubtitle }), Components.Form({ input: Ports.inputs.collection })],
});
