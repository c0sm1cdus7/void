import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { compile } from "desert-sdk/src/index.ts";
import { buildDistribution } from "desert-sdk/src/build/index.ts";
import { assertProductSource } from "desert-sdk/src/authoring/index.ts";

await assertProductSource(fileURLToPath(new URL("../src", import.meta.url)));
const { VoidViewProgram, VoidProduct } = await import("../src/void.product.ts");
const { VoidService, VoidWeb } = await import("../distributions.ts");
const { localMedia } = await import("./local-media.ts");

const manifest = await buildDistribution(compile(VoidProduct), {
  distributions: [VoidService, VoidWeb], target: VoidWeb.id,
  ...localMedia(VoidViewProgram),
  outputDirectory: process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL("../build/void-web", import.meta.url)),
});
console.log(JSON.stringify({ status: manifest.status, distribution: manifest.distributionId,
  contractDigest: manifest.contractDigest }, null, 2));
