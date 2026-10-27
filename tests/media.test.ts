import assert from "node:assert/strict";
import test from "node:test";
import { view, moduleIndex } from "desert-sdk/src/index.ts";
import { MediaModule } from "../src/modules/media/media.module.ts";
import { ImagesView } from "../src/modules/media/views/images.view.ts";
import { ImportImageRecord } from "../src/modules/media/commands/importImage.command.ts";
import { VoidProduct } from "../src/void.product.ts";
import { Messages, m } from "../src/messages/keys.ts";

test("Media has one canonical private library, never a separate sample gallery destination", () => {
  const destination = VoidProduct.viewProgram.destinations.find(item => item.id === "media")!;
  assert.equal(destination.entryJourney, "media-library");
  assert.equal(VoidProduct.viewProgram.destinations.some(item => item.id === "private-images"), false);
  assert.equal(VoidProduct.viewProgram.journeys.some(item => item.id === "browse-media"), false);
  assert.equal(VoidProduct.viewProgram.views.some(item => item.content.some(content => content.kind === "media-library")), false);
  const header = ImagesView.content[0];
  assert.deepEqual(header?.kind === "header" && header.title, m.media.images.title);
  assert.equal(Messages.bundle("en").text(m.media.images.title), "Media");
  const stack = ImagesView.content.find(item => item.kind === "stack" && item.title.key === m.media.images.all.key)!;
  assert.equal(stack.kind === "stack" && stack.items[0]?.kind === "collection" && stack.items[0].presentation?.kind, "media-grid");
});

test("Add media opens the native picker before a transient import and images have no title input", () => {
  const journey = VoidProduct.viewProgram.journeys.find(item => item.id === "import-image")!;
  assert.equal(journey.kind, "create");
  if (journey.kind !== "create") return;
  assert.deepEqual(journey.startWith, { kind: "file-picker", input: "image" });
  assert.equal(journey.presentation, "transient");
  assert.deepEqual(ImportImageRecord.input, ["image", "fit", "description", "collections"]);
  assert.equal(Object.keys(moduleIndex([MediaModule]).commands).includes("renameImage"), false);
});

test("Media remains a typed catalog composition with no product styling escapes", () => {
  assert.equal(view(ImagesView).id, "private-images");
  assert.throws(() => view({ ...ImagesView, class: "my-media" }), /INVALID_VIEW/);
});
