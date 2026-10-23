import { clientDistribution, controllerDistribution, remoteBinding } from "desert-sdk/src/index.ts";
import { Dependencies } from "./src/modules.ts";
import { VOID } from "./src/void.product.ts";
import { VoidAgentSurface, VoidHumanSurface } from "./src/surfaces.ts";

export const VoidService = controllerDistribution({
  id: "void-service", product: VOID, runtime: "node", storage: "postgresql",
  serves: [VoidHumanSurface, VoidAgentSurface], provides: [Dependencies.notes, Dependencies.tasks, Dependencies.media],
});

export const VoidWeb = clientDistribution({
  id: "void-web", product: VOID, surface: VoidHumanSurface,
  renderer: "svelte-web", bindings: [remoteBinding(Dependencies.notes, VoidService), remoteBinding(Dependencies.tasks, VoidService),
    remoteBinding(Dependencies.media, VoidService)],
});
