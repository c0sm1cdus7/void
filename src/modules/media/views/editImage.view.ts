import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { image: "form" }, outputs: ["save", "close"] });

export const EditImageView = defineView({
  name: "edit-image", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.close, label: m.media.close, icon: "close" }] }),
  content: [
    Components.Header({ title: m.media.edit.title, subtitle: m.media.edit.subtitle }),
    Components.Form({ input: Ports.inputs.image }),
  ],
  bottomDock: Components.Toolbar({ actions: [{ output: Ports.output.save, label: m.media.saveChanges, icon: "save" }] }),
});
