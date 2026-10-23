import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { image: "form" }, outputs: ["save", "close"] });

export const RenameImageView = defineView({
  name: "rename-image", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  content: [
    Components.Header({ title: "Rename image" }),
    Components.Form({ input: Ports.inputs.image }),
  ],
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: "Save title", icon: "save" }] }),
});
