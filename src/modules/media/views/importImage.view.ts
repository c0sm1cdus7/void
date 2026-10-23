import { Components, ViewTitles, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { image: "form" }, outputs: ["close", "save"] });

export const ImportImageView = defineView({
  name: "import-image", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: "Close", icon: "close" }] }),
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: "Add media", icon: "save" }] }),
  content: [
    Components.Header({ title: ViewTitles.operation, subtitle: "Choose the presentation and optional collections. Originals are preserved." }),
    Components.Form({ input: Ports.inputs.image }),
  ],
});
