import type { ViewJourney } from "desert-sdk/src/index.ts";
import { VisualCatalogView } from "../views/visualCatalog.view.ts";

export const VisualCatalogJourney = {
  id: "visual-catalog", kind: "presentation", view: VisualCatalogView, outputs: [],
} satisfies ViewJourney;
