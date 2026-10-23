import { controllerRole } from "desert-sdk/src/index.ts";
import { PrivateImage } from "./image.object.ts";
import { MediaCollection } from "./collection.object.ts";

export const MediaController = controllerRole({ id: "media", objects: [PrivateImage, MediaCollection], requires: [] });
