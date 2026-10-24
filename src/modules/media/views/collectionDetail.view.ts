import { Components, ViewTitles, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { m } from "../../../messages/keys.ts";
const Ports = viewPorts({ inputs: { collection: "context", media: "collection" }, outputs: ["back", "import", "select"] });
export const CollectionDetailView = defineView({ name: "media-collection-detail", layout: "gallery", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.back, label: m.media.back, icon: "back" },
    { output: Ports.output.import, label: m.media.addMedia, icon: "create" }] }),
  content: [Components.Header({ title: ViewTitles.subject, subtitle: m.media.collection.detailSubtitle }), Components.Context({ input: Ports.inputs.collection, fields: [] }),
    Components.Stack({ title: m.media.collection.content, items: [Components.Collection({ input: Ports.inputs.media, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image"),
        fit: factReference(PrivateImage, "fit"), description: factReference(PrivateImage, "description") } })] }),
  ],
});
