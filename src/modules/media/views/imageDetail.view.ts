import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { image: "context" }, outputs: ["close"] });

export const ImageDetailView = defineView({
  name: "private-image-detail", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: m.media.close, icon: "close" }] }),
  content: [
    Components.Header({ title: m.media.detail.title, subtitle: m.media.detail.subtitle }),
    Components.Context({ input: Ports.inputs.image,
      fields: [factReference(PrivateImage, "image"), factReference(PrivateImage, "description")],
      presentation: { kind: "media-object", media: factReference(PrivateImage, "image"), description: factReference(PrivateImage, "description") } }),
  ],
});
