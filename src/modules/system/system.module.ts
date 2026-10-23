import { defineModule } from "desert-sdk/src/index.ts";
import { SystemView } from "./views/system.view.ts";
import { InspectSystem } from "./journeys/system.journey.ts";

const SystemDestination = { id: "system", label: "System", icon: "settings", entryJourney: InspectSystem } as const;

export const SystemModule = defineModule({
  id: "system", views: [SystemView], journeys: [{ presentation: InspectSystem }], destinations: [SystemDestination],
  exports: { destinations: { System: SystemDestination }, views: { System: SystemView } },
});
