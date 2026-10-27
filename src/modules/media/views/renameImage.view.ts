import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { image: "form" }, outputs: ["save", "close"] });

export const RenameImageView = defineView({
  name: "rename-image", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: m.media.close, icon: "close" }] }),
  content: [
    Components.Header({ title: m.media.rename.title }),
    Components.Form({ input: Ports.inputs.image }),
  ],
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: m.media.saveTitle, icon: "save" }] }),
});
