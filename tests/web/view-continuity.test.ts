import assert from "node:assert/strict";
import test from "node:test";
import { CreateNote } from "../../src/modules/notes/journeys/createNote.journey.ts";
import { browserFixture, settleMotion } from "./fixture.ts";

function deferred() {
  let resolve = () => {};
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

test("Notes can select another note and create from its main toolbar while a read panel is docked", async () => {
  const f = await browserFixture();
  try {
    for (const title of ["First note", "Second note"]) {
      const run = await f.host.session.begin(CreateNote.id);
      const prepared = await f.host.session.prepare(run.id, { title, body: `${title} body` });
      await f.host.session.accept(prepared.id, prepared.confirmationDigest);
    }
    await f.page.getByRole("button", { name: "Notes", exact: true }).click();
    const main = f.page.getByRole("main", { name: "Notes", exact: true });
    const panel = f.page.locator("[data-adaptive-surface]");
    const title = panel.locator("[data-toolbar-title]");
    await main.getByRole("button", { name: /First note/ }).click();
    await title.getByText("First note", { exact: true }).waitFor();
    await panel.locator('[data-surface-slot="top"]').getByRole("button", { name: "Edit note", exact: true }).waitFor();
    await main.getByRole("button", { name: /Second note/ }).click();
    await title.getByText("Second note", { exact: true }).waitFor();
    await panel.getByText("Second note body", { exact: true }).waitFor();
    await main.getByRole("button", { name: "Create note", exact: true }).click();
    await panel.getByRole("textbox", { name: "Title", exact: true }).fill("Unsubmitted note");
    await panel.getByRole("textbox", { name: "Content", exact: true }).fill("Keep this draft");
    await panel.locator('[data-surface-slot="top"]').getByRole("button", { name: "Close", exact: true }).click();
    await title.getByText("Second note", { exact: true }).waitFor();
    await settleMotion(f.page);
    assert.equal((await f.records()).length, 2, "returning to the selected note does not accept the draft");
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});

for (const operation of ["prepare", "accept"] as const) {
  test(`Notes preserve newer writing while ${operation} is pending without changing the submitted intent`, async () => {
    const f = await browserFixture(), arrived = deferred(), release = deferred();
    try {
      await f.page.getByRole("button", { name: "Notes", exact: true }).click();
      await f.page.getByRole("button", { name: "Create note", exact: true }).click();
      const panel = f.page.locator("[data-adaptive-surface]");
      const title = panel.getByRole("textbox", { name: "Title", exact: true });
      const body = panel.getByRole("textbox", { name: "Content", exact: true });
      const save = panel.getByRole("button", { name: "Save note", exact: true });
      await title.fill("Submitted title");
      await body.fill("Submitted body");
      await f.page.route(`**/api/${operation}`, async route => {
        const response = await route.fetch();
        arrived.resolve();
        await release.promise;
        await route.fulfill({ response });
      });
      await save.click();
      await arrived.promise;
      await body.fill("Newer writing stays in this session");
      release.resolve();
      if (operation === "prepare") {
        await save.and(f.page.locator(":enabled")).waitFor();
        assert.equal(await body.inputValue(), "Newer writing stays in this session");
        assert.equal(f.operations.filter(item => item.operation === "accept").length, 0);
        assert.deepEqual(await f.records(), []);
        await save.click();
        await panel.locator("[data-toolbar-title]").getByText("Submitted title", { exact: true }).waitFor();
        assert.equal((await f.records())[0]?.facts.body, "Newer writing stays in this session");
      } else {
        await panel.locator("[data-toolbar-title]").getByText("Submitted title", { exact: true }).waitFor();
        assert.equal((await f.records())[0]?.facts.body, "Submitted body");
        await panel.locator('[data-surface-slot="top"]').getByRole("button", { name: "Close", exact: true }).click();
        await panel.waitFor({ state: "hidden" });
        await f.page.getByRole("button", { name: "Create note", exact: true }).click();
        assert.equal(await body.inputValue(), "Newer writing stays in this session");
      }
      assert.equal(f.operations.filter(item => item.operation === "accept").length, 1);
      assert.deepEqual(f.errors, []);
    } finally { release.resolve(); await f.close(); }
  });
}
