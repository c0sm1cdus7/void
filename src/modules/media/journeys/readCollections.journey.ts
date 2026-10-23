import { readJourney } from "desert-sdk/src/index.ts";
import { MediaCollection } from "../collection.object.ts";
import { MediaController } from "../media.dependencies.ts";
export const ReadCollections = readJourney("read-media-collections", MediaCollection, {
  fields: ["title", "layout", "cover"], collection: ["title", "cover"], requires: { controller: MediaController, dependencies: [] },
});
