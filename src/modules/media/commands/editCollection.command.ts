import { fromInput, updateCommand } from "desert-sdk/src/index.ts";
import { MediaCollection } from "../collection.object.ts";
export const EditCollectionRecord = updateCommand("edit-media-collection-record", MediaCollection, {
  input: ["title", "layout", "cover"], when: {}, set: { title: fromInput("title"), layout: fromInput("layout"), cover: fromInput("cover") },
});
