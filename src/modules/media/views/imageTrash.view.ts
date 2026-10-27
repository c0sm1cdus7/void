import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { images: "collection" }, outputs: ["images", "select"] });

export const ImageTrashView = defineView({
  name: "image-trash", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.images, label: m.media.backToMedia, icon: "back" }] }),
  content: [
    Components.Header({ title: m.media.trash.title, subtitle: m.media.trash.subtitle }),
    Components.Stack({ title: m.media.trash.deleted, items: [Components.Collection({ input: Ports.inputs.images, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image") } })] }),
  ],
});
