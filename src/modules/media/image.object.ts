import { enumeration, file, namedReferences, objectType, ownershipPolicy, principal, text } from "desert-sdk/src/index.ts";
import { MediaCollection } from "./collection.object.ts";

export const PrivateImage = objectType({
  id: "private-image",
  facts: { title: text(),
    image: file({ accept: ["image/jpeg", "image/png", "image/webp", "video/mp4", "audio/mp4", "audio/mpeg", "audio/wav"], maxBytes: 20_971_520 }),
    fit: enumeration(["fill", "fit"]), description: text(),
    collections: namedReferences(MediaCollection, { label: "title" }),
    owner: principal(), state: enumeration(["active", "trashed"]) },
});

export const PrivateImages = ownershipPolicy(PrivateImage, "owner");
