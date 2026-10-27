import { factReference, publishObject } from "desert-sdk/src/index.ts";
import { PrivateImage } from "./image.object.ts";
import { ImageDetailView } from "./views/imageDetail.view.ts";
import { TrashImage } from "./journeys/trashImage.journey.ts";
import { RestoreImage } from "./journeys/restoreImage.journey.ts";
import { EditImage } from "./journeys/editImage.journey.ts";
import { m } from "../../messages/keys.ts";

export const PublishedImage = publishObject(PrivateImage, {
  view: ImageDetailView,
  title: factReference(PrivateImage, "title"),
  fields: [
    { fact: factReference(PrivateImage, "title"), label: m.media.titleField, representation: "text" },
    { fact: factReference(PrivateImage, "image"), label: m.media.fileField, representation: "image" },
    { fact: factReference(PrivateImage, "fit"), label: m.media.fitField, representation: "text" },
    { fact: factReference(PrivateImage, "description"), label: m.media.descriptionField, representation: "paragraphs" },
    { fact: factReference(PrivateImage, "collections"), label: m.media.collectionsField, representation: "tags" },
    { fact: factReference(PrivateImage, "state"), label: m.media.statusField, representation: "text" },
  ],
  actions: [
    { journey: EditImage, icon: "edit" },
    { journey: TrashImage, icon: "archive" },
    { journey: RestoreImage, icon: "restore" },
  ],
});
