import { mutationJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { RestoreImageRecord } from "../commands/restoreImage.command.ts";
import { MediaController } from "../media.dependencies.ts";
import { ReadImageTrash } from "./readImageTrash.journey.ts";

export const RestoreImage = mutationJourney("restore-image", RestoreImageRecord, { controller: MediaController, dependencies: [] });
export const RestoreImageExperience = {
  id: RestoreImage.id, kind: "action", source: ReadImageTrash, outputs: [],
} satisfies ViewJourney;
