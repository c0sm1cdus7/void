import { defineModule } from "desert-sdk/src/index.ts";
import { AdjustAppearance } from "./journeys/appearance.journey.ts";
import { AppearanceView } from "./views/appearance.view.ts";

const AppearanceDestination = {
  id: "appearance", label: "Appearance", icon: "palette", entryJourney: AdjustAppearance,
} as const;

export const AppearanceModule = defineModule({
  id: "appearance", views: [AppearanceView], journeys: [{ presentation: AdjustAppearance }],
  destinations: [AppearanceDestination],
  exports: { destinations: { Appearance: AppearanceDestination }, views: { Appearance: AppearanceView } },
});
