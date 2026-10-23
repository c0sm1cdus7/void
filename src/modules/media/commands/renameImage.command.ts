import { fromInput, updateCommand } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

export const RenameImageRecord = updateCommand("rename-image-record", PrivateImage, {
  input: ["title"], when: { state: "active" }, set: { title: fromInput("title") },
});
