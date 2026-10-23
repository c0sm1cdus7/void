import { defineModule } from "desert-sdk/src/index.ts";
import { IdentityView } from "./views/identity.view.ts";
import { InspectIdentity } from "./journeys/identity.journey.ts";

const IdentityDestination = { id: "identity", label: "Identity", icon: "lock", entryJourney: InspectIdentity } as const;

export const IdentityModule = defineModule({
  id: "identity", views: [IdentityView], journeys: [{ presentation: InspectIdentity }], destinations: [IdentityDestination],
  exports: { destinations: { Identity: IdentityDestination }, views: { Identity: IdentityView } },
});
