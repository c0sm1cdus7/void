import { viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { ImagesView } from "../views/images.view.ts";
import { ImageDetailView } from "../views/imageDetail.view.ts";
import { ReadImages } from "./readImages.journey.ts";
import { ImportImage } from "./importImage.journey.ts";
import { ReadImageTrash } from "./readImageTrash.journey.ts";

export const ReadImagesExperience = {
  id: ReadImages.id, kind: "read", view: ImagesView, detailView: ImageDetailView,
  outputs: [
    { ...viewOutput(ImagesView, "import"), action: { kind: "journey", journey: ImportImage } },
    { ...viewOutput(ImagesView, "select"), action: { kind: "select" } },
    { ...viewOutput(ImagesView, "trash"), action: { kind: "journey", journey: ReadImageTrash } },
    { ...viewOutput(ImageDetailView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
