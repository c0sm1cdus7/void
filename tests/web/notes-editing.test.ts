import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture } from "./fixture.ts";

test("the object owns its toolbar title and editing reuses the editor without changing identity", async () => {
  const f = await browserFixture();
  try {
    const button = (name: string) => f.page.getByRole("button", { name, exact: true });
    const title = f.page.getByRole("textbox", { name: "Title", exact: true });
    const body = f.page.getByRole("textbox", { name: "Content", exact: true });
    await button("Create note").click();
    await title.fill("Published object title");
    await body.fill("The body belongs to the note, not to a private renderer.");
    const created = f.page.waitForResponse(response => new URL(response.url()).pathname === "/api/accept");
    await button("Save note").click();
    assert.equal((await created).status(), 200);
    await title.waitFor({ state: "hidden" });
    const top = f.page.locator('[data-adaptive-surface] [data-surface-slot="top"]');
    await top.getByText("Published object title", { exact: true }).waitFor();
    await top.getByRole("button", { name: "Edit note", exact: true }).click();
    assert.equal(await title.inputValue(), "Published object title");
    assert.equal(await body.inputValue(), "The body belongs to the note, not to a private renderer.");
    const before = await f.records();
    await title.fill("Edited object title");
    await body.fill("Edited with the same canonical command on every surface.");
    const saved = f.page.waitForResponse(response => new URL(response.url()).pathname === "/api/accept");
    await button("Save note").click();
    assert.equal((await saved).status(), 200);
    await title.waitFor({ state: "hidden" });
    await top.getByText("Edited object title", { exact: true }).waitFor();
    const after = await f.records();
    assert.equal(after.length, 1);
    assert.equal(after[0]!.id, before[0]!.id);
    assert.equal(after[0]!.version, 2);
    assert.deepEqual(after[0]!.facts, {
      title: "Edited object title", body: "Edited with the same canonical command on every surface.",
    });
    assert.deepEqual(f.operations.filter(item => item.operation === "begin" && item.input.journeyId === "edit-note")
      .map(item => item.input.subject), [before[0]!.id]);
    const prepares = f.operations.filter(item => item.operation === "prepare");
    assert.equal(prepares.length, 2);
    assert.deepEqual(prepares[1]!.input.options, { expectedVersion: 1 }, "editing carries the original revision as metadata");
    await f.screenshot("notes-object-editing");
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});

test("published edit availability follows the controller without replaying a write", async () => {
  const f = await browserFixture();
  try {
    await f.page.getByRole("button", { name: "Create note", exact: true }).click();
    await f.page.getByRole("textbox", { name: "Title", exact: true }).fill("Availability witness");
    await f.page.getByRole("button", { name: "Save note", exact: true }).click();
    const edit = f.page.locator('[data-adaptive-surface] [data-surface-slot="top"]')
      .getByRole("button", { name: "Edit note", exact: true });
    await edit.waitFor();
    await f.page.waitForFunction(() => {
      const button = document.querySelector<HTMLButtonElement>('[data-adaptive-surface] button[aria-label="Edit note"]');
      return button?.disabled === false;
    });
    assert.equal(await edit.isEnabled(), true);
    const writes = f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length;
    await f.host.close();
    await f.page.waitForFunction(() => {
      const button = document.querySelector<HTMLButtonElement>('[data-adaptive-surface] button[aria-label="Edit note"]');
      return button?.disabled === true;
    });
    assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, writes);
  } finally { await f.close(); }
});
