import { factReference, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaCollection } from "../collection.object.ts";
import { MediaOverviewView } from "../views/mediaOverview.view.ts";
import { ReadImages } from "./readImages.journey.ts";
import { ReadCollections } from "./readCollections.journey.ts";
import { ImportImage } from "./importImage.journey.ts";
import { ReadImageTrash } from "./readImageTrash.journey.ts";
export const BrowseMediaOverview = { id: "media-library", kind: "presentation", view: MediaOverviewView,
  collections: [{ input: "collections", read: ReadCollections, limit: 200,
    preview: { read: ReadImages, where: factReference(PrivateImage, "collections"), media: factReference(PrivateImage, "image"),
      cover: factReference(MediaCollection, "cover") } },
    { input: "media", read: ReadImages, limit: 200 }],
  outputs: [
    { ...viewOutput(MediaOverviewView, "collection"), action: { kind: "select" } },
    { ...viewOutput(MediaOverviewView, "select"), action: { kind: "select" } },
    { ...viewOutput(MediaOverviewView, "import"), action: { kind: "journey", journey: ImportImage } },
    { ...viewOutput(MediaOverviewView, "trash"), action: { kind: "journey", journey: ReadImageTrash } },
  ],
} satisfies ViewJourney;
