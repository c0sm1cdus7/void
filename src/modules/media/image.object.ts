import { enumeration, mediaAsset, namedReferences, objectType, ownershipPolicy, principal, text } from "desert-sdk/src/index.ts";
import { MediaCollection } from "./collection.object.ts";

export const PrivateImage = objectType({
  id: "private-image",
  facts: { title: text(), image: mediaAsset(), fit: enumeration(["fill", "fit"]), description: text(),
    collections: namedReferences(MediaCollection, { label: "title" }),
    owner: principal(), state: enumeration(["active", "trashed"]) },
});

export const PrivateImages = ownershipPolicy(PrivateImage, "owner");
