import { literal, updateCommand } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

export const TrashImageRecord = updateCommand("trash-image-record", PrivateImage, {
  input: [], when: { state: "active" }, set: { state: literal("trashed") },
});
