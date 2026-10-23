import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

const Ports = viewPorts({ inputs: { images: "collection" }, outputs: ["images", "select"] });

export const ImageTrashView = defineView({
  name: "image-trash", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.images, label: "Back to Media", icon: "back" }] }),
  content: [
    Components.Header({ title: "Media Trash", subtitle: "Originals stay private and can be restored." }),
    Components.Stack({ title: "Deleted media", items: [Components.Collection({ input: Ports.inputs.images, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image") } })] }),
  ],
});
