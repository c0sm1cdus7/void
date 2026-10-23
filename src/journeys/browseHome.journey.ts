import { viewOutput, factReference, type ViewJourney } from "desert-sdk/src/index.ts";
import { HomeView } from "../views/home.view.ts";
import { Journeys, Objects } from "../modules.ts";

export const HomeJourney = {
  id: "home", kind: "presentation", view: HomeView,
  collections: [
    { input: "tasks", read: Journeys.readTasks, limit: 200,
      summary:{field:factReference(Objects.Task,'status'),segments:[{value:'open',label:'Open'},{value:'completed',label:'Completed'}]} },
  ],
  outputs: [{ ...viewOutput(HomeView, "create"),
    action: { kind: "journey", journey: Journeys.createNote } },
    { ...viewOutput(HomeView, "tasks"), action: { kind: "journey", journey: Journeys.readTasks } }],
} satisfies ViewJourney;
