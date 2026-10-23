import assert from "node:assert/strict";
import test from "node:test";
import { Journeys } from "../src/modules.ts";
import { openMediaTestHost } from "./support/media-host.ts";

test("contextual media editing and reversible Trash preserve the exact private asset and enforce the current read", async t => {
  const f = await openMediaTestHost(); t.after(f.close);
  const active = await f.human.begin(Journeys.readImages.id, f.id);
  assert.deepEqual((await f.human.image(active.id, f.asset.reference, "original")).bytes, f.original);
  const rename = await f.agent.prepare((await f.agent.begin(Journeys.editImage.id, f.id)).id,
    { fit: "fit", description: "A private landscape", collections: [] }, { expectedVersion: 1 });
  await f.agent.accept(rename.id, rename.confirmationDigest);
  assert.deepEqual(await f.human.read(active.id), [{ id: f.id, version: 2,
    facts: { title: "", image: f.asset, fit: "fit", description: "A private landscape", collections: [] } }]);
  const trash = await f.human.prepare((await f.human.begin(Journeys.trashImage.id, f.id)).id, {});
  assert.equal((await f.human.read(active.id)).length, 1, "preparation does not move the image");
  const receipt = await f.human.accept(trash.id, trash.confirmationDigest);
  assert.deepEqual(await f.human.accept(trash.id, trash.confirmationDigest), receipt);
  assert.deepEqual(await f.human.read(active.id), []);
  await assert.rejects(f.human.image(active.id, f.asset.reference, 160));
  assert.equal((await f.human.offer(Journeys.editImage.id, f.id)).eligible, false);
  const trashed = await f.human.begin(Journeys.readImageTrash.id, f.id);
  assert.deepEqual((await f.human.image(trashed.id, f.asset.reference, "original")).bytes, f.original);
  const restore = await f.agent.prepare((await f.agent.begin(Journeys.restoreImage.id, f.id)).id, {});
  await f.agent.accept(restore.id, restore.confirmationDigest);
  assert.deepEqual(await f.human.read(trashed.id), []);
  await assert.rejects(f.human.image(trashed.id, f.asset.reference, 160));
  assert.deepEqual(await f.human.read(active.id), [{ id: f.id, version: 4,
    facts: { title: "", image: f.asset, fit: "fit", description: "A private landscape", collections: [] } }]);
  assert.deepEqual((await f.human.image(active.id, f.asset.reference, "original")).bytes, f.original);
});

test("image updates reject foreign authority and stale revisions without moving or replacing private data", async t => {
  const f = await openMediaTestHost(); t.after(f.close);
  for (const journey of [Journeys.editImage, Journeys.trashImage, Journeys.restoreImage, Journeys.readImageTrash]) {
    await assert.rejects(f.foreign.begin(journey.id, f.id), /NOT_FOUND/);
  }
  const stale = await f.human.prepare((await f.human.begin(Journeys.trashImage.id, f.id)).id, {});
  const rename = await f.human.prepare((await f.human.begin(Journeys.editImage.id, f.id)).id,
    { fit: "fill", description: "Newer revision", collections: [] }, { expectedVersion: 1 });
  await f.human.accept(rename.id, rename.confirmationDigest);
  await assert.rejects(f.human.accept(stale.id, stale.confirmationDigest), /VERSION_CONFLICT/);
  const read = await f.human.begin(Journeys.readImages.id, f.id);
  assert.deepEqual(await f.human.read(read.id), [{ id: f.id, version: 2,
    facts: { title: "", image: f.asset, fit: "fill", description: "Newer revision", collections: [] } }]);
  assert.deepEqual((await f.human.image(read.id, f.asset.reference, "original")).bytes, f.original);
});
