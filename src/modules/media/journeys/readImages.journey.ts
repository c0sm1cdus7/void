import { readJourney } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaController } from "../media.dependencies.ts";

export const ReadImages = readJourney("read-images", PrivateImage, {
  fields: ["title", "image", "fit", "description", "collections"], collection: ["image", "fit", "description", "collections"],
  where: { state: "active" },
  requires: { controller: MediaController, dependencies: [] },
});
