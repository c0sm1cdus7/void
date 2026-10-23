import { factReference, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaCollection } from "../collection.object.ts";
import { CollectionsView } from "../views/collections.view.ts";
import { CollectionDetailView } from "../views/collectionDetail.view.ts";
import { ReadCollections } from "./readCollections.journey.ts";
import { ReadImages } from "./readImages.journey.ts";
import { ImportImage } from "./importImage.journey.ts";
import { SetMediaCollections } from "./setMediaCollections.journey.ts";
export const ReadCollectionsJourney = { id: ReadCollections.id, kind: "read", presentation: "main",
  view: CollectionsView, detailView: CollectionDetailView,
  related: [{ input: "media", read: ReadImages, layout: factReference(MediaCollection, "layout"),
    membership: { update: SetMediaCollections, input: "collections" },
    where: { field: factReference(PrivateImage, "collections"), includes: "subject" } }],
  outputs: [
    { ...viewOutput(CollectionsView, "back"), action: { kind: "back" } },
    { ...viewOutput(CollectionsView, "select"), action: { kind: "select" } },
    { ...viewOutput(CollectionDetailView, "back"), action: { kind: "back" } },
    { ...viewOutput(CollectionDetailView, "select"), action: { kind: "select" } },
    { ...viewOutput(CollectionDetailView, "import"), action: { kind: "journey", journey: ImportImage } },
  ],
} satisfies ViewJourney;
