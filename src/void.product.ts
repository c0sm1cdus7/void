import { composeProduct } from "desert-sdk/src/index.ts";
import { Modules } from "./modules.ts";
import { HomeJourney } from "./journeys/browseHome.journey.ts";
import { HomeView } from "./views/home.view.ts";
import { WorkspaceView } from "./views/workspace.view.ts";
import { NavigationView } from "./views/navigation.view.ts";
import { HomeDestination, VoidNavigation } from "./navigation.ts";
import { VoidAgentSurface, VoidHumanSurface } from "./surfaces.ts";

/** The only authored root. DESERT derives execution, views and the storyboard. */
export const VoidProduct = composeProduct({
  id: "void", label: "VOID",
  modules: Modules,
  views: [HomeView, WorkspaceView, NavigationView], workspace: WorkspaceView,
  journeys: [{ presentation: HomeJourney }],
  destinations: [HomeDestination], surfaces: [VoidHumanSurface, VoidAgentSurface],
  entry: HomeDestination, navigation: VoidNavigation,
});

export const VOID = VoidProduct.definition;
export const VoidViewProgram = VoidProduct.viewProgram;
