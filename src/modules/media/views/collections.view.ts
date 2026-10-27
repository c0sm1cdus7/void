import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { MediaCollection } from "../collection.object.ts";
import { m } from "../../../messages/keys.ts";
const Ports = viewPorts({ inputs: { collections: "collection" }, outputs: ["back", "select"] });
export const CollectionsView = defineView({ name: "media-collections", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.back, label: m.media.back, icon: "back" }] }),
  content: [Components.Header({ title: m.media.collections.title, subtitle: m.media.collections.subtitle }), Components.Stack({ title: m.media.collections.all, items: [
    Components.Collection({ input: Ports.inputs.collections, output: Ports.output.select, fields: [factReference(MediaCollection, "title")] }),
  ] })],
});
