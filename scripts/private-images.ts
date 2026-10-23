import { join } from "node:path";
import type { PrivateImageStorage } from "desert-sdk/src/assets/host.ts";

export function privateImages(directory: string): PrivateImageStorage {
  return {
    directory: join(directory, "images"),
    quota: { totalBytes: 1024 * 1024 * 1024, totalAssets: 1000,
      identityBytes: 512 * 1024 * 1024, identityAssets: 500 },
  };
}
