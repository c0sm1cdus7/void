import { viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { ImageTrashView } from "../views/imageTrash.view.ts";
import { ImageDetailView } from "../views/imageDetail.view.ts";
import { ReadImages } from "./readImages.journey.ts";
import { ReadImageTrash } from "./readImageTrash.journey.ts";

export const ReadImageTrashJourney = {
  id: ReadImageTrash.id, kind: "read", view: ImageTrashView, detailView: ImageDetailView,
  outputs: [
    { ...viewOutput(ImageTrashView, "images"), action: { kind: "back" } },
    { ...viewOutput(ImageTrashView, "select"), action: { kind: "select" } },
    { ...viewOutput(ImageDetailView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
