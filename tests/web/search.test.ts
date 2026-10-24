import assert from "node:assert/strict";
import test from "node:test";
import type { Page } from "playwright";
import { ResolvedNodes } from "desert-sdk/src/interaction/catalog.ts";
import { sharedCatalogOwners } from "desert-sdk/src/svelte/infra/shared-owners.ts";
import { CreateNote } from "../../src/modules/notes/journeys/createNote.journey.ts";
import { browserFixture, settleMotion } from "./fixture.ts";

const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
const base = (page: Page) => page.locator("[data-catalog-scroll]");
const overlay = (page: Page) => page.locator("[data-catalog-search-scroll]");
const search = (page: Page) => page.getByRole("searchbox");

async function expectSearchClosed(page: Page) {
  await overlay(page).waitFor({ state: "hidden" });
  assert.equal(await search(page).count(), 0, "closed search has no accessible searchbox in the surface");
  assert.equal(await base(page).locator('input[type="search"]').count(), 0,
    "the content has no inline search, including hidden retained destinations");
}

async function openSearch(page: Page) {
  await button(page, "Search").click();
  await overlay(page).waitFor();
  assert.equal(await search(page).count(), 1, "one toolbar field owns the overlay query");
  assert.equal(await search(page).evaluate(element => element.closest("[data-catalog-search-actions]") !== null), true);
  assert.equal(await search(page).evaluate(element => document.activeElement === element), true);
  assert.equal(await base(page).getAttribute("inert"), "", "the underlying collection is inert while searching");
}

async function catalogContents(page: Page) {
  return base(page).locator("[data-catalog-index] [data-destination]").evaluateAll(entries => entries.map(entry => ({
    id: entry.getAttribute("data-destination"),
    text: entry.textContent,
    inputs: Array.from(entry.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select"))
      .map(input => ({ value: input.value, disabled: input.disabled })),
  })));
}

for (const width of [390, 1600]) {
  test(`Notes has only toolbar search, never content search, at ${width}px`, async () => {
    const f = await browserFixture();
    try {
      await button(f.page, "Notes").click();
      await f.page.setViewportSize({ width, height: 844 });
      await settleMotion(f.page);
      await expectSearchClosed(f.page);
      await openSearch(f.page);
      await button(f.page, "Close search").click();
      await expectSearchClosed(f.page);
      assert.deepEqual(f.errors, []);
      assert.deepEqual(await f.records(), []);
    } finally { await f.close(); }
  });

  test(`Notes overlay searches displayed fields without filtering the collection at ${width}px`, async () => {
    const f = await browserFixture();
    try {
      const notes = [
        { title: "Atlas observation", body: "Private nebula witness, excluded from the loaded collection." },
        { title: "Harbor observation", body: "Another private note body." },
      ];
      for (const facts of notes) {
        const run = await f.host.session.begin(CreateNote.id);
        const intent = await f.host.session.prepare(run.id, facts);
        await f.host.session.accept(intent.id, intent.confirmationDigest);
      }
      await button(f.page, "Notes").click();
      await button(f.page, "Atlas observation").waitFor();
      await button(f.page, "Harbor observation").waitFor();
      await f.page.setViewportSize({ width, height: 844 });
      await settleMotion(f.page);
      const records = await f.records();
      const unchanged = await base(f.page).innerText();
      const operations = f.operations.length;

      await openSearch(f.page);
      await search(f.page).fill("Atlas");
      await overlay(f.page).getByRole("status").filter({ hasText: "1 result" }).waitFor();
      assert.equal(await overlay(f.page).locator("[data-search-result]").count(), 1);
      assert.equal(await overlay(f.page).getByRole("button", { name: "Atlas observation", exact: true }).count(), 1);
      assert.equal(await base(f.page).innerText(), unchanged, "search does not mutate, replace or filter the base collection");

      for (const privateQuery of ["nebula", records[0]!.id]) {
        await search(f.page).fill(privateQuery);
        await overlay(f.page).getByText("No matching results", { exact: true }).waitFor();
        assert.equal(await overlay(f.page).locator("[data-search-result]").count(), 0,
          "private body and internal identifiers are not indexed");
        assert.equal(await base(f.page).innerText(), unchanged);
      }

      await f.page.keyboard.press("Escape");
      await overlay(f.page).waitFor({ state: "hidden" });
      assert.equal(await button(f.page, "Search").evaluate(element => document.activeElement === element), true);
      await openSearch(f.page);
      assert.equal(await search(f.page).inputValue(), "", "Escape clears the prior query");
      await search(f.page).fill("Harbor");
      await button(f.page, "Close search").click();
      await overlay(f.page).waitFor({ state: "hidden" });
      assert.equal(await button(f.page, "Search").evaluate(element => document.activeElement === element), true);
      await openSearch(f.page);
      assert.equal(await search(f.page).inputValue(), "", "the toolbar close action clears the prior query");
      await search(f.page).fill("Atlas");
      await overlay(f.page).getByRole("button", { name: "Atlas observation", exact: true }).click();
      await overlay(f.page).waitFor({ state: "hidden" });
      await f.page.locator("[data-adaptive-surface]").getByText(notes[0]!.body, { exact: true }).waitFor();
      assert.equal(await base(f.page).innerText(), unchanged, "opening a result retains the original list");
      assert.deepEqual(await f.records(), records, "search and selection never write note data");
      assert.equal(f.operations.slice(operations).filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });

  test(`Visual catalog uses the same toolbar overlay without inline filtering at ${width}px`, async () => {
    const f = await browserFixture();
    try {
      await button(f.page, "Visual catalog").click();
      await base(f.page).locator("[data-catalog-index]").waitFor();
      await f.page.setViewportSize({ width, height: 844 });
      await settleMotion(f.page);
      await expectSearchClosed(f.page);
      const unchanged = await catalogContents(f.page);
      const semanticIds = new Set<string>(ResolvedNodes.entries.map(entry => entry.id));
      assert.deepEqual(unchanged.map(entry => entry.id).filter(id => semanticIds.has(id!)).sort(),
        ResolvedNodes.entries.map(entry => entry.id).sort(), "all registered catalog entries are present before search");
      assert.equal(new Set(unchanged.map(entry => entry.id)).size, unchanged.length,
        "semantic entries and shared owners each have one index destination");
      const sharedOwners = new Set<string>(sharedCatalogOwners);
      for (const entry of unchanged.filter(entry => !semanticIds.has(entry.id!))) {
        assert.ok(sharedOwners.has(entry.id!), "every additional composition is a registered shared owner");
      }
      await openSearch(f.page);
      await search(f.page).fill("date");
      const date = overlay(f.page).locator('[data-search-result="control.date"]');
      await date.waitFor();
      assert.deepEqual(await catalogContents(f.page), unchanged, "the catalog retains every entry and specimen value behind the overlay");
      await date.getByRole("button").click();
      await expectSearchClosed(f.page);
      await base(f.page).locator('[data-catalog-entry="control.date"]:visible').waitFor();
      assert.equal(await base(f.page).locator('[data-catalog-entry]:visible').count(), 1,
        "the result opens the selected real specimen, not a duplicate inline catalog");
      assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
      assert.deepEqual(await f.records(), []);
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });
}
