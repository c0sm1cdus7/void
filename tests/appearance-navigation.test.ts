import assert from "node:assert/strict";
import test from "node:test";
import { VoidViewProgram } from "../src/void.product.ts";

test("Appearance uses a palette while System retains its settings cog", () => {
  assert.equal(VoidViewProgram.destinations.find(item => item.id === "appearance")?.icon, "palette");
  assert.equal(VoidViewProgram.destinations.find(item => item.id === "system")?.icon, "settings");
});
