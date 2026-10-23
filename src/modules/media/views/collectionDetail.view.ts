import { Components, ViewTitles, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
const Ports = viewPorts({ inputs: { collection: "context", media: "collection" }, outputs: ["back", "import", "select"] });
export const CollectionDetailView = defineView({ name: "media-collection-detail", layout: "gallery", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.back, label: "Back", icon: "back" },
    { output: Ports.output.import, label: "Add media", icon: "create" }] }),
  content: [Components.Header({ title: ViewTitles.subject, subtitle: "Media gathered in this collection." }), Components.Context({ input: Ports.inputs.collection, fields: [] }),
    Components.Stack({ title: "Content", items: [Components.Collection({ input: Ports.inputs.media, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image"),
        fit: factReference(PrivateImage, "fit"), description: factReference(PrivateImage, "description") } })] }),
  ],
});
