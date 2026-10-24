import type { ViewDestination } from "desert-sdk/src/index.ts";
import { HomeJourney } from "./journeys/browseHome.journey.ts";
import { Destinations } from "./modules.ts";
import { m } from "./messages/keys.ts";

export const HomeDestination = {
  id: "home", label: m.home.destination, icon: "open", entryJourney: HomeJourney,
} satisfies ViewDestination;

export const VoidNavigation = [
  { destination: HomeDestination, group: m.void.explore, purpose: "content" },
  { destination: Destinations.Notes, group: m.void.explore, purpose: "content" },
  { destination: Destinations.Tasks, group: m.void.explore, purpose: "content" },
  { destination: Destinations.Media, group: m.void.explore, purpose: "content" },
  { destination: Destinations.System, group: m.void.settings, purpose: "utility" },
  { destination: Destinations.Appearance, group: m.void.settings, purpose: "utility" },
  { destination: Destinations.Identity, group: m.void.settings, purpose: "utility" },
  { destination: Destinations.VisualCatalog, group: m.void.developer, purpose: "utility" },
] as const;
