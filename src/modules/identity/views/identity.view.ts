import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: {}, outputs: ["lock"] });

export const IdentityView = defineView({
  name: "identity", outputs: Ports.outputs,
  topDock: Components.Toolbar({ actions: [{ output: Ports.output.lock, label: "Lock VOID", icon: "lock" }] }),
  content: [
    Components.Header({ title: "Identity", subtitle: "Your access to this VOID instance." }),
    Components.Identity(),
  ],
});
