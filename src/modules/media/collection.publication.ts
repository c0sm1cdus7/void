import { factReference, publishObject } from "desert-sdk/src/index.ts";
import { MediaCollection } from "./collection.object.ts";
import { CollectionDetailView } from "./views/collectionDetail.view.ts";
import { EditCollection } from "./journeys/editCollection.journey.ts";
import { m } from "../../messages/keys.ts";
export const PublishedCollection = publishObject(MediaCollection, {
  view: CollectionDetailView, title: factReference(MediaCollection, "title"), fields: [
    { fact: factReference(MediaCollection, "title"), label: m.media.collection.nameField, representation: "text" },
    { fact: factReference(MediaCollection, "layout"), label: m.media.collection.presentationField, representation: "text" },
    { fact: factReference(MediaCollection, "cover"), label: m.media.collection.coverField, representation: "tags" },
  ], actions: [{ journey: EditCollection, icon: "edit" }],
});
