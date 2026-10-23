import type { ViewJourney } from "desert-sdk/src/index.ts";
import { SystemView } from "../views/system.view.ts";

export const InspectSystem = {
  id: "inspect-system", kind: "presentation", view: SystemView, outputs: [],
} satisfies ViewJourney;
