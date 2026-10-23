import { factReference, initializeInput, mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { EditImageRecord } from "../commands/editImage.command.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaController } from "../media.dependencies.ts";
import { EditImageView } from "../views/editImage.view.ts";
import { ReadImages } from "./readImages.journey.ts";

export const EditImage = mutationJourney("edit-image", EditImageRecord, { controller: MediaController, dependencies: [] });

export const EditImageExperience = {
  id: EditImage.id, kind: "update", source: ReadImages, view: EditImageView, preferredDock: "right", presentation: "transient",
  initialize: [initializeInput(EditImageRecord, "fit", factReference(PrivateImage, "fit")),
    initializeInput(EditImageRecord, "description", factReference(PrivateImage, "description")),
    initializeInput(EditImageRecord, "collections", factReference(PrivateImage, "collections"))],
  outputs: [
    { ...viewOutput(EditImageView, "save"), action: { kind: "submit" } },
    { ...viewOutput(EditImageView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
