import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

const Ports = viewPorts({ inputs: { image: "context" }, outputs: ["close"] });

export const ImageDetailView = defineView({
  name: "private-image-detail", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  content: [
    Components.Header({ title: "Media", subtitle: "View this item and edit its presentation." }),
    Components.Context({ input: Ports.inputs.image,
      fields: [factReference(PrivateImage, "image"), factReference(PrivateImage, "description")],
      presentation: { kind: "media-object", media: factReference(PrivateImage, "image"), description: factReference(PrivateImage, "description") } }),
  ],
});
