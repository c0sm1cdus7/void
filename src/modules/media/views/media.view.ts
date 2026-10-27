import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { LocalMediaLibrary } from "../media.library.ts";
import { m } from "../../../messages/keys.ts";
const Ports = viewPorts({ inputs: {}, outputs: ["images", "import"] });

export const MediaView = defineView({
  name: "media", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [
    { output: Ports.output.images, label: m.media.myImages, icon: "media" },
    { output: Ports.output.import, label: m.media.importImage, icon: "create" },
  ] }),
  content: [
    Components.Header({ title: m.media.library.title, subtitle: m.media.library.subtitle }),
    Components.MediaLibrary({ library: LocalMediaLibrary }),
  ],
});
