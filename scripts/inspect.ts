import { fileURLToPath } from "node:url";
import { compile } from "desert-sdk/src/index.ts";
import { assertProductSource } from "desert-sdk/src/authoring/index.ts";

await assertProductSource(fileURLToPath(new URL("../src", import.meta.url)));
const { VoidProduct } = await import("../src/void.product.ts");
console.log(JSON.stringify({
  productId: VoidProduct.definition.id,
  contractDigest: compile(VoidProduct).digest,
  catalog: VoidProduct.catalog,
  storyboard: VoidProduct.storyboard,
}, null, 2));
