import assert from "node:assert/strict";
import test from "node:test";
import { compile } from "desert-sdk/src/index.ts";
import { VOID, VoidViewProgram, VoidProduct } from "../src/void.product.ts";
import { Journeys, Commands, Dependencies } from "../src/modules.ts";
import { VoidAgentSurface, VoidHumanSurface } from "../src/surfaces.ts";

test("private images use one owned object and a canonical import operation", () => {
  assert.equal(Journeys.importImage.kind, "journey");
  assert.equal(Commands.importImage.id, "import-image-record");
  assert.equal(Journeys.readImages.id, "read-images");
  assert.equal(Dependencies.media.id, "media");
  assert.ok(VoidHumanSurface.journeys.some(journey => journey.id === Journeys.importImage.id));
  assert.ok(!new Set<string>(VoidAgentSurface.journeys.map(journey => journey.id)).has(Journeys.importImage.id));
  assert.ok(VoidAgentSurface.journeys.some(journey => journey.id === Journeys.readImages.id));
  assert.doesNotThrow(() => compile(VoidProduct));
  const experience = VoidViewProgram.journeys.find(item => item.id === Journeys.importImage.id);
  assert.equal(experience?.kind, "create");
  assert.equal(experience?.kind === "create" && experience.source, Journeys.readImages.id);
});
