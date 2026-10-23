import { enumeration, mediaReferences, objectType, ownershipPolicy, principal, text } from "desert-sdk/src/index.ts";

export const MediaCollection = objectType({ id: "media-collection", facts: {
  title: text({ minLength: 1, maxLength: 120 }), layout: enumeration(["grid", "list"]), owner: principal(),
  cover: mediaReferences("private-image", { media: "image", maxItems: 1, memberOf: "collections", where: { state: "active" } }),
} });
export const PrivateCollections = ownershipPolicy(MediaCollection, "owner");
