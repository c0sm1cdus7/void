import { Components, defineView, factReference, viewPorts } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

const Ports = viewPorts({ inputs: { images: "collection" }, outputs: ["import", "select", "trash"] });

export const ImagesView = defineView({
  name: "private-images", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.import, label: "Add media", icon: "create" },
  ] }),
  content: [
    Components.Header({ title: "Media", subtitle: "Private to your identity. Originals are preserved." }),
    Components.Stack({ title: "Media", items: [Components.Collection({ input: Ports.inputs.images, output: Ports.output.select,
      presentation: { kind: "media-grid", image: factReference(PrivateImage, "image"),
        fit: factReference(PrivateImage, "fit"), description: factReference(PrivateImage, "description") } })] }),
    Components.Stack({ title: "Manage media", items: [Components.DestinationLink({ output: Ports.output.trash, label: "Trash", icon: "archive" })] }),
  ],
});
