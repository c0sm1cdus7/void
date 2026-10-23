import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { MediaCollection } from "../collection.object.ts";
const Ports = viewPorts({ inputs: { collections: "collection" }, outputs: ["back", "select"] });
export const CollectionsView = defineView({ name: "media-collections", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.back, label: "Back", icon: "back" }] }),
  content: [Components.Header({ title: "Collections", subtitle: "Named groups for your images, video and audio." }), Components.Stack({ title: "Collections", items: [
    Components.Collection({ input: Ports.inputs.collections, output: Ports.output.select, fields: [factReference(MediaCollection, "title")] }),
  ] })],
});
