import { actorId, createCommand, fromInput, literal } from "desert-sdk/src/index.ts";
import { MediaCollection } from "../collection.object.ts";
export const CreateCollectionRecord = createCommand("create-media-collection-record", MediaCollection, {
  input: ["title"], values: { title: fromInput("title"), layout: literal("grid"), cover: literal([]), owner: actorId() },
});
