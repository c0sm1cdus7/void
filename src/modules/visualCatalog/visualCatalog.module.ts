import { defineModule } from "desert-sdk/src/index.ts";
import { VisualCatalogJourney } from "./journeys/browseVisualCatalog.journey.ts";
import { VisualCatalogView } from "./views/visualCatalog.view.ts";

const VisualCatalogDestination = {
  id: "visual-catalog", label: "Visual catalog", icon: "catalog", entryJourney: VisualCatalogJourney,
} as const;

export const VisualCatalogModule = defineModule({
  id: "visual-catalog",
  views: [VisualCatalogView],
  journeys: [{ presentation: VisualCatalogJourney }],
  destinations: [VisualCatalogDestination],
  exports: { destinations: { VisualCatalog: VisualCatalogDestination }, views: { VisualCatalog: VisualCatalogView } },
});
