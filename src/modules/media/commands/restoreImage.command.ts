import { literal, updateCommand } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

export const RestoreImageRecord = updateCommand("restore-image-record", PrivateImage, {
  input: [], when: { state: "trashed" }, set: { state: literal("active") },
});
