import type { ViewJourney } from "desert-sdk/src/index.ts";
import { HomeView } from "../views/home.view.ts";
import { CreateNote } from "./createNote.journey.ts";

export const HomeJourney = {
  id: "home", kind: "presentation", view: HomeView.id,
  outputs: [{ view: HomeView.id, output: "create",
    action: { kind: "journey", journey: CreateNote.id } }],
} satisfies ViewJourney;
