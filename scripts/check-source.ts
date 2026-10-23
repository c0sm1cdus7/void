import { fileURLToPath } from "node:url";
import { assertProductSource } from "desert-sdk/src/authoring/index.ts";

const checked = await assertProductSource(fileURLToPath(new URL("../src", import.meta.url)));
console.log(`Validated ${checked.files.length} product declaration files before evaluation.`);
