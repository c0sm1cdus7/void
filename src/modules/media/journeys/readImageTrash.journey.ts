import { readJourney } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaController } from "../media.dependencies.ts";

export const ReadImageTrash = readJourney("read-image-trash", PrivateImage, {
  fields: ["title", "image", "fit", "description", "collections", "state"], collection: ["image", "fit", "description", "collections"], where: { state: "trashed" },
  requires: { controller: MediaController, dependencies: [] },
});
