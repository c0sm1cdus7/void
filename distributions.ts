import { clientDistribution, controllerDistribution, remoteBinding } from "desert-sdk/src/index.ts";
import { NotesController } from "./dependencies.ts";
import { VOID } from "./product.ts";
import { AgentNotes, HumanNotes } from "./surfaces.ts";

export const VoidService = controllerDistribution({
  id: "void-service", product: VOID, runtime: "node", storage: "postgresql",
  serves: [HumanNotes, AgentNotes], provides: [NotesController],
});

export const VoidWeb = clientDistribution({
  id: "void-web", product: VOID, surface: HumanNotes,
  renderer: "svelte-web", bindings: [remoteBinding(NotesController, VoidService)],
});
