import { loadAppleReference } from "desert-sdk/products/landmarks/reference.ts";
import type { LocalMediaBinding } from "desert-sdk/src/build/index.ts";
import type { ViewProgram } from "desert-sdk/src/index.ts";
import { mediaLibraryAssets } from "desert-sdk/src/views/media-library.ts";
import { dirname, isAbsolute, relative, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Local infrastructure only. Sample photographs remain outside VOID and its web build. */
export function localMedia(program: ViewProgram): { media?: LocalMediaBinding } {
  const required = new Set(program.views.flatMap(view => view.content.flatMap(item =>
    item.kind === "media-library" ? mediaLibraryAssets(item.library) : [])));
  // A private library has no bundled example photographs or empty attestation.
  if (required.size === 0) return {};
  const { sourceRoot, source } = loadAppleReference();
  const sampleRoot = fileURLToPath(new URL("../assets/media-samples/", import.meta.url));
  let sharedRoot = sourceRoot;
  while (relative(sharedRoot, sampleRoot).startsWith("..") || isAbsolute(relative(sharedRoot, sampleRoot))) sharedRoot = dirname(sharedRoot);
  const assets = [
    ...source.assets.filter(asset => required.has(asset.id)).map(asset => ({ ...asset,
      path: join(relative(sharedRoot, sourceRoot), asset.path) })),
    ...[
      { id: "void-motion-study", path: "motion-study.webm", alt: "Original silent motion study" },
      { id: "void-motion-poster", path: "motion-study.png", alt: "Motion study poster" },
      { id: "void-motion-captions", path: "motion-study.vtt", alt: "English captions" },
      { id: "void-quiet-tones", path: "quiet-tones.wav", alt: "Original quiet tones" },
    ].filter(asset => required.has(asset.id)).map(asset => ({ ...asset, path: join(relative(sharedRoot, sampleRoot), asset.path) })),
  ];
  if (assets.length !== required.size) throw new Error("VOID_LOCAL_MEDIA_BINDING_MISSING");
  return { media: { sourceRoot: sharedRoot, assets } };
}
