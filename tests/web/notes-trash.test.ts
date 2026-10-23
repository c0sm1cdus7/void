import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture } from "./fixture.ts";

for (const width of [390, 1600]) {
  test(`Notes confirms Trash in a compact dialog and restores the same note at ${width}px`, async () => {
    const f = await browserFixture();
    try {
      const button = (name: string) => f.page.getByRole("button", { name, exact: true });
      await button("Notes").click();
      await f.page.setViewportSize({ width, height: 1000 });
      await button("Create note").click();
      await f.page.getByRole("textbox", { name: "Title", exact: true }).fill("Recoverable note");
      await f.page.getByRole("textbox", { name: "Content", exact: true }).fill("This body survives Trash and Restore.");
      await button("Save note").click();
      const panel = f.page.locator("[data-adaptive-surface]");
      const top = panel.locator('[data-surface-slot="top"]');
      await top.getByText("Recoverable note", { exact: true }).waitFor();
      const [original] = await f.records();
      assert.ok(original);
      await top.getByRole("button", { name: "Move to Trash", exact: true }).click();
      const confirmation = f.page.getByRole('dialog');
      await confirmation.getByText("Move to Trash?", { exact: true }).waitFor();
      assert.equal(await f.page.getByText("Review · Move to Trash", { exact: true }).count(),0);
      assert.ok((await confirmation.boundingBox())!.height < 500, "confirmation is a compact dialog, not a full-height review surface");
      assert.equal((await f.records()).length, 1, "opening confirmation does not move the note");
      await confirmation.getByRole("button", { name: "Cancel", exact: true }).click();
      await top.getByText("Recoverable note", { exact: true }).waitFor();
      assert.equal((await f.records()).length, 1, "back cancels without changing the note");
      await top.getByRole("button", { name: "Move to Trash", exact: true }).click();
      await confirmation.getByText("Move to Trash?", { exact: true }).waitFor();
      const accepted = f.page.waitForResponse(response => new URL(response.url()).pathname === "/api/accept");
      await confirmation.getByRole("button", { name: "Move to Trash", exact: true }).click();
      assert.equal((await accepted).status(), 200);
      await panel.waitFor({ state: "hidden" });
      assert.deepEqual(await f.records(), []);
      await button("Trash").click();
      await f.page.getByRole("main", { name: "Trash", exact: true }).waitFor();
      await f.page.getByRole("button", { name: "Recoverable note", exact: true }).click();
      await top.getByText("Recoverable note", { exact: true }).waitFor();
      assert.equal(await top.getByRole("button", { name: "Edit note", exact: true }).count(), 0);
      assert.equal(await top.getByRole("button", { name: "Move to Trash", exact: true }).count(), 0);
      await f.screenshot(`notes-trash-${width}`);
      const restored = f.page.waitForResponse(response => new URL(response.url()).pathname === "/api/accept");
      await top.getByRole("button", { name: "Restore note", exact: true }).click();
      assert.equal((await restored).status(), 200);
      await panel.waitFor({ state: "hidden" });
      await button("Back").click();
      await f.page.getByRole("button", { name: "Recoverable note", exact: true }).click();
      await top.getByText("Recoverable note", { exact: true }).waitFor();
      await f.page.getByText("This body survives Trash and Restore.", { exact: true }).waitFor();
      const [after] = await f.records();
      assert.equal(after?.id, original.id);
      assert.equal(after?.version, 3);
      assert.deepEqual(after?.facts, original.facts);
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });
}
