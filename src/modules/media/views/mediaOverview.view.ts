import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaCollection } from "../collection.object.ts";
import { m } from "../../../messages/keys.ts";
const Ports = viewPorts({ inputs: { collections: "collection", media: "collection" }, outputs: ["import", "collection", "select", "trash"] });

export const MediaOverviewView = defineView({ name: "media-overview", layout: "gallery", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.import, label: m.media.addMedia, icon: "create" }] }),
  content: [Components.Header({ title: m.media.overview.title, subtitle: m.media.overview.subtitle }),
    Components.Stack({ title: m.media.overview.collections, items: [Components.Collection({ input: Ports.inputs.collections, output: Ports.output.collection,
      presentation: { kind: "collection-grid", title: factReference(MediaCollection, "title") } })] }),
    Components.Stack({ title: m.media.overview.media, items: [Components.Collection({ input: Ports.inputs.media, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image"),
        fit: factReference(PrivateImage, "fit"), description: factReference(PrivateImage, "description") } })] }),
    Components.Stack({ title: m.media.manage, items: [Components.DestinationLink({ output: Ports.output.trash, label: m.media.trashLink, icon: "archive" })] }),
  ],
});
