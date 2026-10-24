import { defineModule } from "desert-sdk/src/index.ts";
import { IdentityView } from "./views/identity.view.ts";
import { InspectIdentity } from "./journeys/identity.journey.ts";
import { m } from "../../messages/keys.ts";

const IdentityDestination = { id: "identity", label: m.identity.destination, icon: "lock", entryJourney: InspectIdentity } as const;

export const IdentityModule = defineModule({
  id: "identity", views: [IdentityView], journeys: [{ presentation: InspectIdentity }], destinations: [IdentityDestination],
  exports: { destinations: { Identity: IdentityDestination }, views: { Identity: IdentityView } },
});
