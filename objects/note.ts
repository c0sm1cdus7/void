import { objectType, ownershipPolicy, principal, text } from "desert-sdk/src/index.ts";

export const Note = objectType({
  id: "note",
  facts: {
    title: text(),
    body: text(),
    owner: principal(),
  },
});

export const PrivateNotes = ownershipPolicy(Note, "owner");
