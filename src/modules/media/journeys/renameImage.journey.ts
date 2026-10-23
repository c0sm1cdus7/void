import { factReference, initializeInput, mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { RenameImageRecord } from "../commands/renameImage.command.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaController } from "../media.dependencies.ts";
import { RenameImageView } from "../views/renameImage.view.ts";
import { ReadImages } from "./readImages.journey.ts";

export const RenameImage = mutationJourney("rename-image", RenameImageRecord, { controller: MediaController, dependencies: [] });

export const RenameImageExperience = {
  id: RenameImage.id, kind: "update", source: ReadImages, view: RenameImageView, preferredDock: "right",
  initialize: [initializeInput(RenameImageRecord, "title", factReference(PrivateImage, "title"))],
  outputs: [
    { ...viewOutput(RenameImageView, "save"), action: { kind: "submit" } },
    { ...viewOutput(RenameImageView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
