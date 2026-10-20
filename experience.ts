import { ViewProgramVersion, type ViewProgram } from "desert-sdk/src/index.ts";
import { VOID } from "./product.ts";
import { VoidViews } from "./views/index.ts";
import { HomeJourney } from "./journeys/home.journey.ts";
import { ReadNotesExperience } from "./journeys/readNotes.journey.ts";
import { CreateNoteExperience } from "./journeys/createNote.journey.ts";
import { VisualCatalogJourney } from "./journeys/visualCatalog.journey.ts";

/** Product composition only: execution, geometry and rendering belong to DESERT. */
export const VoidViewProgram = {
  version: ViewProgramVersion, productId: VOID.id, label: "VOID",
  views: VoidViews,
  journeys: [HomeJourney, ReadNotesExperience, CreateNoteExperience, VisualCatalogJourney],
  destinations: [
    { id: "home", label: "Home", icon: "open", entryJourney: HomeJourney.id },
    { id: "notes", label: "Notes", icon: "create", entryJourney: ReadNotesExperience.id },
    { id: "visual-catalog", label: "Visual catalog", icon: "catalog", entryJourney: VisualCatalogJourney.id },
  ],
  entry: "home", navigation: ["home", "notes", "visual-catalog"],
} satisfies ViewProgram;
