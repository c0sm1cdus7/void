import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture, settleMotion } from "./fixture.ts";

for (const width of [390, 1600]) {
  test(`shared top toolbar returns the Visual catalog to zero without changing its actions at ${width}px`, async () => {
    const f = await browserFixture({ hasTouch: width === 390 });
    try {
      await f.page.getByRole("button", { name: "Visual catalog", exact: true }).click();
      await f.page.setViewportSize({ width, height: 844 });
      await settleMotion(f.page);
      const viewport = f.page.locator("[data-catalog-scroll]");
      const toolbar = f.page.locator("[data-place-toolbar]");
      const title = toolbar.locator("[data-identity-title]");
      async function scrollDown() {
        await viewport.evaluate(element => { element.scrollTop = 800; });
        await f.page.waitForFunction(() => Number(getComputedStyle(document.querySelector('[data-toolbar-identity]')!).opacity) > .9);
        await toolbar.getByRole("button", { name: "Back to top", exact: true }).waitFor({ state: "attached" });
      }
      async function atTop() {
        await f.page.waitForFunction(() => document.querySelector('[data-catalog-scroll]')!.scrollTop === 0);
        // The heading handoff must not snap a completed return away from zero.
        await f.page.evaluate(async () => { for (let i = 0; i < 24; i++) await new Promise(requestAnimationFrame); });
        assert.equal(await viewport.evaluate(element => element.scrollTop), 0);
        assert.equal(await f.page.evaluate(() => document.scrollingElement!.scrollTop), 0);
      }
      assert.equal(await viewport.getByRole("link", { name: "Back to catalog navigation", exact: true }).count(), 0);
      await scrollDown();
      assert.equal(await title.evaluate(element => getComputedStyle(element).cursor), "pointer");
      await f.screenshot(`toolbar-return-scrolled-${width}`);
      // The compact identity is a noninteractive visual continuation. Its
      // shared toolbar receives the real pointer event at the title location.
      const titleBounds = (await title.boundingBox())!;
      const x = titleBounds.x + 10, y = titleBounds.y + titleBounds.height / 2;
      if (width === 390) await f.page.touchscreen.tap(x, y);
      else await f.page.mouse.click(x, y);
      await atTop();

      await scrollDown();
      await f.page.getByRole("button", { name: "Search", exact: true }).click();
      await f.page.getByRole("searchbox").waitFor();
      assert.equal(await viewport.evaluate(element => element.scrollTop), 800, "search does not trigger the toolbar shortcut");
      await f.page.getByRole("button", { name: "Close search", exact: true }).click();
      await f.page.locator("[data-catalog-search-scroll]").waitFor({ state: "hidden" });
      assert.equal(await viewport.evaluate(element => element.scrollTop), 800, "closing search preserves the reading position");

      const bounds = (await toolbar.boundingBox())!;
      await f.page.mouse.click(bounds.x + bounds.width * .65, bounds.y + 5);
      await atTop();

      // Exercise native wheel scrolling followed immediately by the shortcut.
      await f.page.mouse.move(width - 32, 360);
      await f.page.mouse.wheel(0, 620);
      await f.page.waitForFunction(() => document.querySelector('[data-catalog-scroll]')!.scrollTop > 500);
      await toolbar.getByRole("button", { name: "Back to top", exact: true }).focus();
      await f.page.keyboard.press("Enter");
      await atTop();
      await f.screenshot(`toolbar-return-top-${width}`);
      assert.deepEqual(await f.records(), []);
      assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });
}
