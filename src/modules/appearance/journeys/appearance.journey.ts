import type { ViewJourney } from "desert-sdk/src/index.ts";
import { AppearanceView } from "../views/appearance.view.ts";

export const AdjustAppearance = {
  id: "adjust-appearance", kind: "presentation", view: AppearanceView, outputs: [],
} satisfies ViewJourney;
