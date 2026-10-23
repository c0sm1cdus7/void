import { actorId, createCommand, fromInput, literal } from "desert-sdk/src/index.ts";
import { PrivateImage } from "../image.object.ts";

export const ImportImageRecord = createCommand("import-image-record", PrivateImage, {
  input: ["image", "fit", "description", "collections"],
  values: { title: literal(""), image: fromInput("image"), fit: fromInput("fit"), description: fromInput("description"),
    collections: fromInput("collections"), owner: actorId(), state: literal("active") },
});
