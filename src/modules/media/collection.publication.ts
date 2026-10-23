import { factReference, publishObject } from "desert-sdk/src/index.ts";
import { MediaCollection } from "./collection.object.ts";
import { CollectionDetailView } from "./views/collectionDetail.view.ts";
import { EditCollection } from "./journeys/editCollection.journey.ts";
export const PublishedCollection = publishObject(MediaCollection, {
  view: CollectionDetailView, title: factReference(MediaCollection, "title"), fields: [
    { fact: factReference(MediaCollection, "title"), label: "Collection name", representation: "text" },
    { fact: factReference(MediaCollection, "layout"), label: "Presentation", representation: "text" },
    { fact: factReference(MediaCollection, "cover"), label: "Cover", representation: "tags" },
  ], actions: [{ journey: EditCollection, icon: "edit" }],
});
