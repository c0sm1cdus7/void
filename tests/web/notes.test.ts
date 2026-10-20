import assert from "node:assert/strict";
import test from "node:test";
import type { Page } from "playwright";
import { CreateNote } from "../../journeys/createNote.journey.ts";
import { browserFixture, settleMotion } from "./fixture.ts";

const title = (page: Page) => page.getByRole("textbox", { name: "Title", exact: true });
const content = (page: Page) => page.getByRole("textbox", { name: "Content", exact: true });
const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });

async function save(page: Page) {
  const accepted = page.waitForResponse(response => new URL(response.url()).pathname === "/api/accept");
  await button(page, "Save note").click();
  assert.equal((await accepted).status(), 200, "the canonical controller must accept the note");
  await title(page).waitFor({ state: "hidden" });
}

test("Home and Notes start the same create journey and render durable notes", async () => {
  const f = await browserFixture();
  try {
    for (const entry of ["Home", "Notes"]) {
      if (entry === "Notes") await button(f.page, "Notes").click();
      const before = f.operations.length;
      await button(f.page, "Create note").click();
      await title(f.page).fill(`Created from ${entry}`);
      await content(f.page).fill(`Persistent content from ${entry}.`);
      await save(f.page);
      assert.deepEqual(f.operations.slice(before).filter(item => item.operation === "begin")
        .filter(item => item.input.journeyId === CreateNote.id).map(item => item.input.journeyId), [CreateNote.id]);
      await f.page.getByText(`Created from ${entry}`, { exact: true }).first().waitFor();
    }
    assert.deepEqual((await f.records()).map(record => record.facts).sort((a, b) => String(a.title).localeCompare(String(b.title))), [
      { title: "Created from Home", body: "Persistent content from Home." },
      { title: "Created from Notes", body: "Persistent content from Notes." },
    ]);
    await f.screenshot("notes-created-wide");
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});

test("an untitled note preserves the empty title and is readable through UI after reload", async () => {
  const f = await browserFixture();
  try {
    await button(f.page, "Notes").click();
    await button(f.page, "Create note").click();
    assert.equal(await title(f.page).inputValue(), "");
    await content(f.page).fill("Untitled persistence witness.\nThe second line survives too.");
    await save(f.page);
    const [record] = await f.records();
    assert.deepEqual(record?.facts, { title: "", body: "Untitled persistence witness.\nThe second line survives too." });
    await f.page.reload();
    await button(f.page, "Notes").click();
    await f.page.getByRole("button", { name: /Untitled/ }).click();
    await f.page.getByText("Untitled persistence witness.", { exact: false }).waitFor();
    await f.page.getByText("The second line survives too.", { exact: false }).waitFor();
    assert.deepEqual((await f.records()).map(item => item.facts), [record!.facts]);
    await f.screenshot("notes-untitled-read-after-reload");
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});

test("right-docked and transient editor keep one unsubmitted draft across viewport changes", async () => {
  const f = await browserFixture();
  try {
    await button(f.page, "Create note").click();
    await title(f.page).fill("Same draft");
    await content(f.page).fill("Keep this while changing presentation.");
    const admissions = f.operations.filter(item => item.operation === "begin" && item.input.journeyId === CreateNote.id).length;
    await f.page.locator('[data-adaptive-surface][data-presentation="docked"]').waitFor();
    await button(f.page, "Notes").click({ trial: true });
    await f.screenshot("notes-editor-docked-wide");
    await f.page.setViewportSize({ width: 390, height: 844 });
    await f.page.locator('[data-adaptive-surface][data-presentation="transient"]').waitFor();
    assert.equal(await title(f.page).inputValue(), "Same draft");
    assert.equal(await content(f.page).inputValue(), "Keep this while changing presentation.");
    await content(f.page).fill("Edited while narrow.");
    await f.screenshot("notes-editor-transient-narrow");
    await f.page.setViewportSize({ width: 1600, height: 1000 });
    await f.page.locator('[data-adaptive-surface][data-presentation="docked"]').waitFor();
    await button(f.page, "Notes").click({ trial: true });
    assert.equal(await title(f.page).inputValue(), "Same draft");
    assert.equal(await content(f.page).inputValue(), "Edited while narrow.");
    assert.equal(f.operations.filter(item => item.operation === "begin" && item.input.journeyId === CreateNote.id).length, admissions,
      "changing presentation must not admit another operation");
    assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
    assert.deepEqual(await f.records(), []);
    await f.page.locator('[data-adaptive-surface] [data-surface-slot="top"]').getByRole("button", { name: "Close", exact: true }).click();
    await title(f.page).waitFor({ state: "hidden" });
    assert.deepEqual(await f.records(), []);
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});

test("Visual catalog navigation never submits a command and remains available without the Notes controller", async () => {
  const f = await browserFixture();
  try {
    await button(f.page, "Visual catalog").click();
    await f.page.getByRole("main", { name: "Visual catalog", exact: true }).waitFor();
    await f.page.getByRole("heading", { name: "Foundations", exact: true }).waitFor();
    await f.screenshot("visual-catalog-wide");
    assert.deepEqual(await f.records(), []);
    await f.host.close();
    await button(f.page, "Home").click();
    await button(f.page, "Visual catalog").click();
    await f.page.getByRole("heading", { name: "Foundations", exact: true }).waitFor();
    await f.page.setViewportSize({ width: 390, height: 844 });
    await settleMotion(f.page);
    assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    await f.screenshot("visual-catalog-controller-down-narrow");
    assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});
