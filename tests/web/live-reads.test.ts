import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture, settleMotion } from "./fixture.ts";
import { choosePrivateImage } from "./media-ui.ts";
import { Journeys } from "../../src/modules.ts";

for (const width of [390, 1600]) {
  test(`connected Notes observes canonical changes and keeps an open editor draft at ${width}px`, async () => {
    const f = await browserFixture();
    try {
      const button = (name: string) => f.page.getByRole("button", { name, exact: true });
      await button("Notes").click();
      await f.page.setViewportSize({ width, height: 1000 });
      const creation = await f.host.session.begin(Journeys.createNote.id);
      const prepared = await f.host.session.prepare(creation.id, { title: "Created elsewhere", body: "Original body" });
      await f.host.session.accept(prepared.id, prepared.confirmationDigest);
      await button("Created elsewhere").click();
      const panel = f.page.locator("[data-adaptive-surface]");
      const top = panel.locator('[data-surface-slot="top"]');
      await top.getByText("Created elsewhere", { exact: true }).waitFor();
      const [original] = await f.records();
      assert.ok(original);
      async function edit(title: string, body: string) {
        const [base] = await f.host.session.read((await f.host.session.begin(Journeys.readNotes.id, original!.id)).id);
        assert.ok(base);
        const run = await f.host.session.begin(Journeys.editNote.id, original!.id);
        const intent = await f.host.session.prepare(run.id, { title, body }, { expectedVersion: base.version });
        await f.host.session.accept(intent.id, intent.confirmationDigest);
      }
      await edit("Changed elsewhere", "A second client changed this note.");
      await top.getByText("Changed elsewhere", { exact: true }).waitFor();
      await panel.getByText("A second client changed this note.", { exact: true }).waitFor();
      await settleMotion(f.page);
      const editAction = top.getByRole("button", { name: "Edit note", exact: true });
      if (await editAction.count()) await editAction.click();
      else {
        await top.getByRole("button", { name: "More actions", exact: true }).click();
        await f.page.getByRole("dialog", { name: "More actions", exact: true })
          .getByRole("button", { name: "Edit note", exact: true }).click();
      }
      const title = panel.getByRole("textbox", { name: "Title", exact: true });
      await title.fill("My unsent draft");
      const refreshed = f.page.waitForResponse(async response => {
        if (new URL(response.url()).pathname !== "/api/read" || response.status() !== 200) return false;
        const value: unknown = await response.json();
        return Array.isArray(value) && value.some(record => record?.facts?.title === "Third revision");
      });
      await edit("Third revision", "The published object advanced again.");
      await refreshed;
      assert.equal(await title.inputValue(), "My unsent draft", "A live read cannot rewrite the editor's unsent draft");
      assert.equal(f.operations.filter(operation => operation.operation === "prepare" || operation.operation === "accept").length, 0,
        "The browser's live reads cannot execute or replay a command");
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });

  test(`an externally trashed image leaves the selected view and revokes delivered pixels at ${width}px`, async () => {
    const f = await browserFixture();
    try {
      const button = (name: string) => f.page.getByRole("button", { name, exact: true });
      await button("Media").click();
      await f.page.setViewportSize({ width, height: 1000 });
      const panel = await choosePrivateImage(f.page);
      await panel.getByRole("button", { name: "Add media", exact: true }).click();
      await panel.locator('[data-image-state="ready"]').waitFor();
      const url = await panel.locator('[data-media-object] [data-image-state="ready"] img').getAttribute("src");
      assert.ok(url?.startsWith("blob:"));
      const decodes = () => f.page.evaluate(async source => {
        const image = new Image(); image.src = source!;
        try { await image.decode(); return true; } catch { return false; }
      }, url);
      assert.equal(await decodes(), true, "The URL initially exposes a decodable image");
      const [record] = await f.host.session.read((await f.host.session.begin(Journeys.readImages.id)).id);
      assert.ok(record);
      const run = await f.host.session.begin(Journeys.trashImage.id, record.id);
      const intent = await f.host.session.prepare(run.id, {});
      await f.host.session.accept(intent.id, intent.confirmationDigest);
      await panel.waitFor({ state: "hidden" });
      assert.equal(await decodes(), false, "The former Blob URL no longer exposes the image");
      assert.equal(f.operations.filter(operation => operation.operation === "accept").length, 1,
        "Only the explicit import was accepted through the browser");
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });
}
