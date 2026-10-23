import { factReference, publishObject } from "desert-sdk/src/index.ts";
import { PrivateImage } from "./image.object.ts";
import { ImageDetailView } from "./views/imageDetail.view.ts";
import { TrashImage } from "./journeys/trashImage.journey.ts";
import { RestoreImage } from "./journeys/restoreImage.journey.ts";
import { EditImage } from "./journeys/editImage.journey.ts";

export const PublishedImage = publishObject(PrivateImage, {
  view: ImageDetailView,
  title: factReference(PrivateImage, "title"),
  fields: [
    { fact: factReference(PrivateImage, "title"), label: "Title", representation: "text" },
    { fact: factReference(PrivateImage, "image"), label: "Media file", representation: "image" },
    { fact: factReference(PrivateImage, "fit"), label: "Thumbnail fit", representation: "text" },
    { fact: factReference(PrivateImage, "description"), label: "Description", representation: "paragraphs" },
    { fact: factReference(PrivateImage, "collections"), label: "Collections", representation: "tags" },
    { fact: factReference(PrivateImage, "state"), label: "Status", representation: "text" },
  ],
  actions: [
    { journey: EditImage, icon: "edit" },
    { journey: TrashImage, icon: "archive" },
    { journey: RestoreImage, icon: "restore" },
  ],
});
