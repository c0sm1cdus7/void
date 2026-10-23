import { enumeration, objectType, ownershipPolicy, principal, text } from "desert-sdk/src/index.ts";

export const Note = objectType({
  id: "note",
  facts: {
    title: text(),
    body: text(),
    owner: principal(),
    state: enumeration(["active", "trashed"]),
  },
});

export const PrivateNotes = ownershipPolicy(Note, "owner");
