import { fromInput, mutationJourney, updateCommand } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";
import { MediaController } from "../media.dependencies.ts";

export const SetMediaCollectionsRecord = updateCommand("set-media-collections-record", PrivateImage, {
  input: ["collections"], when: { state: "active" }, set: { collections: fromInput("collections") },
});
export const SetMediaCollections = mutationJourney("set-media-collections", SetMediaCollectionsRecord,
  { controller: MediaController, dependencies: [] });
