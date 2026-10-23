import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaCollection } from "../collection.object.ts";
const Ports = viewPorts({ inputs: { collections: "collection", media: "collection" }, outputs: ["import", "collection", "select", "trash"] });

export const MediaOverviewView = defineView({ name: "media-overview", layout: "gallery", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.import, label: "Add media", icon: "create" }] }),
  content: [Components.Header({ title: "Media", subtitle: "Your private media and collections. Originals are preserved." }),
    Components.Stack({ title: "Collections", items: [Components.Collection({ input: Ports.inputs.collections, output: Ports.output.collection,
      presentation: { kind: "collection-grid", title: factReference(MediaCollection, "title") } })] }),
    Components.Stack({ title: "Media", items: [Components.Collection({ input: Ports.inputs.media, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image"),
        fit: factReference(PrivateImage, "fit"), description: factReference(PrivateImage, "description") } })] }),
    Components.Stack({ title: "Manage media", items: [Components.DestinationLink({ output: Ports.output.trash, label: "Trash", icon: "archive" })] }),
  ],
});
