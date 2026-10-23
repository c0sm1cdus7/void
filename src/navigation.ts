import type { ViewDestination } from "desert-sdk/src/index.ts";
import { HomeJourney } from "./journeys/browseHome.journey.ts";
import { Destinations } from "./modules.ts";

export const HomeDestination = {
  id: "home", label: "Home", icon: "open", entryJourney: HomeJourney,
} satisfies ViewDestination;

export const VoidNavigation = [
  { destination: HomeDestination, group: "Explore", purpose: "content" },
  { destination: Destinations.Notes, group: "Explore", purpose: "content" },
  { destination: Destinations.Tasks, group: "Explore", purpose: "content" },
  { destination: Destinations.Media, group: "Explore", purpose: "content" },
  { destination: Destinations.System, group: "Settings", purpose: "utility" },
  { destination: Destinations.Appearance, group: "Settings", purpose: "utility" },
  { destination: Destinations.Identity, group: "Settings", purpose: "utility" },
  { destination: Destinations.VisualCatalog, group: "Developer", purpose: "utility" },
] as const;
