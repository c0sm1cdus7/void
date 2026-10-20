import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { compile } from "desert-sdk/src/index.ts";
import { buildDistribution } from "desert-sdk/src/build/index.ts";
import { VOID } from "../product.ts";
import { VoidService, VoidWeb } from "../distributions.ts";
import { VoidViewProgram } from "../experience.ts";

const manifest = await buildDistribution(compile(VOID), {
  distributions: [VoidService, VoidWeb], target: VoidWeb.id,
  viewProgram: VoidViewProgram,
  outputDirectory: process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL("../build/void-web", import.meta.url)),
});
console.log(JSON.stringify({ status: manifest.status, distribution: manifest.distributionId,
  contractDigest: manifest.contractDigest }, null, 2));
