import { mutationJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { TrashImageRecord } from "../commands/trashImage.command.ts";
import { MediaController } from "../media.dependencies.ts";
import { ReadImages } from "./readImages.journey.ts";

export const TrashImage = mutationJourney("trash-image", TrashImageRecord, { controller: MediaController, dependencies: [] });
export const TrashImageExperience = {
  id: TrashImage.id, kind: "action", source: ReadImages, outputs: [],
} satisfies ViewJourney;
