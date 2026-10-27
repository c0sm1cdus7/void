import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { images: "collection" }, outputs: ["import", "select", "trash"] });

export const ImagesView = defineView({
  name: "private-images", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.import, label: m.media.addMedia, icon: "create" },
  ] }),
  content: [
    Components.Header({ title: m.media.images.title, subtitle: m.media.images.subtitle }),
    Components.Stack({ title: m.media.images.all, items: [Components.Collection({ input: Ports.inputs.images, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image"),
        fit: factReference(PrivateImage, "fit"), description: factReference(PrivateImage, "description") } })] }),
    Components.Stack({ title: m.media.manage, items: [Components.DestinationLink({ output: Ports.output.trash, label: m.media.trashLink, icon: "archive" })] }),
  ],
});
