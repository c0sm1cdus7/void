import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: {}, outputs: ["lock"] });

export const IdentityView = defineView({
  name: "identity", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.lock, label: m.identity.lock, icon: "lock" }] }),
  content: [
    Components.Header({ title: m.identity.title, subtitle: m.identity.subtitle }),
    Components.Identity(),
  ],
});
