import { chooseFile, mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { ImportImageRecord } from "../commands/importImage.command.ts";
import { MediaController } from "../media.dependencies.ts";
import { ImportImageView } from "../views/importImage.view.ts";
import { ReadImages } from "./readImages.journey.ts";
import { ReadCollections } from "./readCollections.journey.ts";

export const ImportImage = mutationJourney("import-image", ImportImageRecord, {
  controller: MediaController, dependencies: [],
});

export const ImportImageExperience = {
  id: ImportImage.id, kind: "create", source: ReadImages, view: ImportImageView, preferredDock: "right",
  presentation: "transient", startWith: chooseFile(ImportImageRecord, "image"),
  initializeFrom: { input: "collections", source: ReadCollections },
  outputs: [
    { ...viewOutput(ImportImageView, "save"), action: { kind: "submit" } },
    { ...viewOutput(ImportImageView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
