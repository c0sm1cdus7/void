import { viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { MediaView } from "../views/media.view.ts";
import { ReadImages } from "./readImages.journey.ts";
import { ImportImage } from "./importImage.journey.ts";

export const BrowseMedia = {
  id: "browse-media", kind: "presentation", view: MediaView, outputs: [
    { ...viewOutput(MediaView, "images"), action: { kind: "journey", journey: ReadImages } },
    { ...viewOutput(MediaView, "import"), action: { kind: "journey", journey: ImportImage } },
  ],
} satisfies ViewJourney;
