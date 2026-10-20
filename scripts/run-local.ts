import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { compile } from "desert-sdk/src/index.ts";
import { serveDeveloperSurface } from "desert-sdk/src/local/developer-host.ts";
import { VOID } from "../product.ts";
import { NotesController } from "../dependencies.ts";
import { HumanNotes } from "../surfaces.ts";

const server = await serveDeveloperSurface({
  application: compile(VOID), role: NotesController.id, surfaceId: HumanNotes.id,
  directory: process.argv[3] ? resolve(process.argv[3]) : fileURLToPath(new URL("../.local/void", import.meta.url)),
  buildDirectory: process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL("../build/void-web", import.meta.url)),
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
