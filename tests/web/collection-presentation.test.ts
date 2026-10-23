import assert from "node:assert/strict";
import test from "node:test";
import { CreateNote } from "../../src/modules/notes/journeys/createNote.journey.ts";
import { browserFixture, settleMotion } from "./fixture.ts";

test("Notes renders the authored stack without an invented sorting subtitle", async () => {
  const f = await browserFixture();
  try {
    for (const title of ["Zebra", "Atlas"]) {
      const run = await f.host.session.begin(CreateNote.id);
      const intent = await f.host.session.prepare(run.id, { title, body: "Presentation witness." });
      await f.host.session.accept(intent.id, intent.confirmationDigest);
    }
    await f.page.getByRole("button", { name: "Notes", exact: true }).click();
    const stack = f.page.getByRole("group", { name: "All notes", exact: true });
    const rows = stack.locator('[data-record-heading] strong');
    await rows.first().waitFor();
    await stack.getByRole('button',{name:'Atlas',exact:true}).waitFor();
    await stack.getByRole('button',{name:'Zebra',exact:true}).waitFor();
    const records = await f.records();
    const operations = f.operations.length;
    for (const colorScheme of ["dark", "light"] as const) {
      await f.page.emulateMedia({ colorScheme });
      for (const width of [1280, 390]) {
        await f.page.setViewportSize({ width, height: 844 });
        await settleMotion(f.page);
        assert.deepEqual(await rows.allTextContents(), ["Atlas", "Zebra"], "ascending order is unchanged");
        assert.equal(await stack.getByText(/Sorted by/).count(), 0);
        assert.equal(await stack.locator('[data-slot="field-description"]').count(), 0);
        const guide = await stack.getByText("All notes", { exact: true }).evaluate(element => {
          const range = document.createRange(); range.selectNodeContents(element);
          const row = element.closest('fieldset')!.querySelector('[data-record-heading] strong')!;
          // Measure both in one frame: the shared reserve moves during resize.
          return {heading:range.getBoundingClientRect().x,row:row.getBoundingClientRect().x};
        });
        await f.screenshot(`notes-collection-no-caption-${colorScheme}-${width}`);
        assert.ok(Math.abs(guide.heading - guide.row) <= 1,
          `stack title and row text follow the same reading guide: ${JSON.stringify({colorScheme,width,...guide})}`);
        assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      }
    }
    assert.deepEqual(await f.records(), records, "presentation never writes note data");
    assert.equal(f.operations.slice(operations).filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});
