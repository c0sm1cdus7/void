import { defineModule } from "desert-sdk/src/index.ts";
import { SystemView } from "./views/system.view.ts";
import { InspectSystem } from "./journeys/system.journey.ts";
import { m } from "../../messages/keys.ts";

const SystemDestination = { id: "system", label: m.system.destination, icon: "settings", entryJourney: InspectSystem } as const;

export const SystemModule = defineModule({
  id: "system", views: [SystemView], journeys: [{ presentation: InspectSystem }], destinations: [SystemDestination],
  exports: { destinations: { System: SystemDestination }, views: { System: SystemView } },
});
