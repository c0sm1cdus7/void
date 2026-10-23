import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { image: "form" }, outputs: ["save", "close"] });

export const EditImageView = defineView({
  name: "edit-image", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  content: [
    Components.Header({ title: "Edit media", subtitle: "Change its presentation and collections. The original is preserved." }),
    Components.Form({ input: Ports.inputs.image }),
  ],
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: "Save changes", icon: "save" }] }),
});
