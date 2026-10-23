import { fromInput, updateCommand } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

export const EditImageRecord = updateCommand("edit-image-record", PrivateImage, {
  input: ["fit", "description", "collections"], when: { state: "active" },
  set: { fit: fromInput("fit"), description: fromInput("description"), collections: fromInput("collections") },
});
