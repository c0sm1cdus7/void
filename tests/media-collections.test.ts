import assert from "node:assert/strict";
import test from "node:test";
import { Journeys } from "../src/modules.ts";
import { openMediaTestHost } from "./support/media-host.ts";

test("collections are persistent owned objects and media owns a validated membership, not duplicated labels", async t => {
  const f = await openMediaTestHost(); t.after(f.close);
  const creation = await f.human.prepare((await f.human.begin(Journeys.createCollection.id)).id, { title: "Japan" });
  const collection = await f.human.accept(creation.id, creation.confirmationDigest);
  await assert.rejects(f.human.prepare((await f.human.begin(Journeys.editCollection.id, collection.object.id)).id,
    { title: "Japan", layout: "grid", cover: [f.id] }, { expectedVersion: 1 }), 'a nonmember cannot be a cover');
  const assign = await f.human.prepare((await f.human.begin(Journeys.setMediaCollections.id, f.id)).id,
    { collections: [collection.object.id] }, { expectedVersion: 1 });
  await f.human.accept(assign.id, assign.confirmationDigest);
  const media = await f.human.read((await f.human.begin(Journeys.readImages.id, f.id)).id);
  assert.deepEqual(media[0]?.facts.collections, [collection.object.id]);
  const otherPrepared=await f.human.prepare((await f.human.begin(Journeys.createCollection.id)).id,{title:'Research'});
  const other=await f.human.accept(otherPrepared.id,otherPrepared.confirmationDigest);
  const add=await f.human.prepare((await f.human.begin(Journeys.setMediaCollections.id,f.id)).id,
    {collections:[collection.object.id,other.object.id]},{expectedVersion:2});
  await f.human.accept(add.id,add.confirmationDigest);
  await assert.rejects(f.human.prepare((await f.human.begin(Journeys.setMediaCollections.id,f.id)).id,
    {collections:[other.object.id]},{expectedVersion:2}),'stale selection cannot overwrite a newer membership');
  const remove=await f.human.prepare((await f.human.begin(Journeys.setMediaCollections.id,f.id)).id,
    {collections:[collection.object.id]},{expectedVersion:3});
  await f.human.accept(remove.id,remove.confirmationDigest);
  assert.deepEqual((await f.human.read((await f.human.begin(Journeys.readImages.id,f.id)).id))[0]?.facts.collections,[collection.object.id]);
  await assert.rejects(f.foreign.begin(Journeys.setMediaCollections.id,f.id),/NOT_FOUND/);
  const rename = await f.human.prepare((await f.human.begin(Journeys.editCollection.id, collection.object.id)).id,
    { title: "Japan 2026", layout: "list", cover: [f.id] }, { expectedVersion: 1 });
  await f.human.accept(rename.id, rename.confirmationDigest);
  const details = await f.human.read((await f.human.begin(Journeys.readCollections.id, collection.object.id)).id);
  assert.deepEqual(details[0]?.facts, { title: "Japan 2026", layout: "list", cover: [f.id] });
  assert.deepEqual((await f.human.read((await f.human.begin(Journeys.readImages.id, f.id)).id))[0]?.facts.collections, [collection.object.id]);
  await assert.rejects(f.foreign.begin(Journeys.editCollection.id, collection.object.id), /NOT_FOUND/);
  const foreign = await f.foreign.prepare((await f.foreign.begin(Journeys.createCollection.id)).id, { title: "Foreign" });
  const foreignCollection = await f.foreign.accept(foreign.id, foreign.confirmationDigest);
  await assert.rejects(f.human.prepare((await f.human.begin(Journeys.editImage.id, f.id)).id,
    { fit: "fill", description: "", collections: [foreignCollection.object.id] }, { expectedVersion: 4 }));
  const foreignRun = await f.foreign.begin(Journeys.importImage.id);
  const reservation = await f.foreign.reserveImage(foreignRun.id, "image", f.original.length);
  const foreignAsset = await f.foreign.uploadImage(foreignRun.id, "image", reservation.reference, [f.original]);
  const foreignPrepared = await f.foreign.prepare(foreignRun.id, { image: foreignAsset, fit: "fill", description: "", collections: [foreignCollection.object.id] });
  const foreignMedia = await f.foreign.accept(foreignPrepared.id, foreignPrepared.confirmationDigest);
  await assert.rejects(f.human.prepare((await f.human.begin(Journeys.editCollection.id, collection.object.id)).id,
    { title: "Japan 2026", layout: "list", cover: [foreignMedia.object.id] }, { expectedVersion: 2 }));
  const trash = await f.human.prepare((await f.human.begin(Journeys.trashImage.id, f.id)).id, {});
  await f.human.accept(trash.id, trash.confirmationDigest);
  await assert.rejects(f.human.prepare((await f.human.begin(Journeys.editCollection.id, collection.object.id)).id,
    { title: "Japan 2026", layout: "list", cover: [f.id] }, { expectedVersion: 2 }), 'trashed media cannot become a cover');
});
