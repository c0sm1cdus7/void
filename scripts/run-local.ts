import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { compile } from "desert-sdk/src/index.ts";
import { serveIdentityHost } from "desert-sdk/src/local/identity-host.ts";
import { assertProductSource } from "desert-sdk/src/authoring/index.ts";
import { privateImages } from "./private-images.ts";

await assertProductSource(fileURLToPath(new URL("../src", import.meta.url)));
const { VoidViewProgram, VoidProduct } = await import("../src/void.product.ts");
const { Dependencies } = await import("../src/modules.ts");
const { VoidHumanSurface } = await import("../src/surfaces.ts");
const { localMedia } = await import("./local-media.ts");

const directory = process.argv[3] ? resolve(process.argv[3]) : fileURLToPath(new URL("../.local/void", import.meta.url));
const server = await serveIdentityHost({
  application: compile(VoidProduct), roles: [Dependencies.notes.id, Dependencies.tasks.id, Dependencies.media.id], surfaceId: VoidHumanSurface.id,
  directory, privateImages: privateImages(directory),
  buildDirectory: process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL("../build/void-web", import.meta.url)),
  ...localMedia(VoidViewProgram),
  port: process.argv[4] ? Number(process.argv[4]) : 0,
});
console.log(`VOID is running at ${server.origin}. Open the private launch URL in ${server.launchFile}.`);
try {
  await new Promise<void>(resolve => {
    function stop() { process.removeListener("SIGINT", stop); process.removeListener("SIGTERM", stop); resolve(); }
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
} finally { await server.close(); }
