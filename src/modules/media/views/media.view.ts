import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { LocalMediaLibrary } from "../media.library.ts";
const Ports = viewPorts({ inputs: {}, outputs: ["images", "import"] });

export const MediaView = defineView({
  name: "media", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.images, label: "My images", icon: "media" },
    { output: Ports.output.import, label: "Import image", icon: "create" },
  ] }),
  content: [
    Components.Header({ title: "Media", subtitle: "Explore your albums, images, videos and music." }),
    Components.MediaLibrary({ library: LocalMediaLibrary }),
  ],
});
