import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture, settleMotion } from "./fixture.ts";

for (const width of [390, 1280]) test(`approved workspace anatomy and real scrolling at ${width}px`, async () => {
  const f = await browserFixture();
  try {
    await f.page.getByRole("button", { name: "Visual catalog", exact: true }).click();
    await f.page.setViewportSize({ width, height: 844 });
    await settleMotion(f.page);
    const viewport = f.page.locator('[data-catalog-scroll]');
    const box = (await viewport.boundingBox())!;
    assert.equal(box.x, 0, "the parent surface still extends behind its sidebar");
    assert.equal(box.width, width, "docked navigation does not shrink the parent surface");
    assert.ok(await viewport.evaluate(element => element.scrollHeight > element.clientHeight));
    await f.page.mouse.move(width - 32, 360);
    await f.page.mouse.wheel(0, 620);
    await f.page.waitForFunction(() => (document.querySelector('[data-catalog-scroll]')?.scrollTop ?? 0) > 500);
    await f.page.waitForFunction(() => Number(getComputedStyle(document.querySelector('[data-toolbar-identity]')!).opacity) > .9);
    assert.equal(await f.page.evaluate(() => document.scrollingElement!.scrollTop), 0);
    assert.match(await viewport.evaluate(element => (element as HTMLElement).style.maskImage), /linear-gradient/);
    await f.screenshot(`preserved-catalog-scrolled-${width}`);
    await f.page.getByRole("button", { name: "Search", exact: true }).click();
    const input = f.page.getByRole("searchbox").filter({ visible: true });
    await input.fill("date");
    await f.page.locator('[data-search-result="control.date"]').click();
    await f.page.locator('[data-catalog-search-scroll]').waitFor({ state: "hidden" });
    assert.ok(await viewport.evaluate(element => element.scrollTop > 0));
    assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});

test("first note entry uses the shared transient animation and retains its draft on resize", async () => {
  const f = await browserFixture();
  try {
    await f.page.setViewportSize({ width: 390, height: 844 });
    await settleMotion(f.page);
    const recording = f.page.evaluate(async () => {
      const frames: { opacity: number; progress: (number | null | undefined)[] }[] = [];
      for (let index = 0; index < 55; index++) {
        await new Promise(requestAnimationFrame);
        const pane = document.querySelector<HTMLElement>('[data-adaptive-surface]');
        if (pane) frames.push({ opacity: Number(getComputedStyle(pane).opacity),
          progress: pane.getAnimations().map(animation => animation.effect?.getComputedTiming().progress) });
      }
      return frames;
    });
    await f.page.getByRole("button", { name: "Create note", exact: true }).click();
    const frames = await recording;
    assert.ok(frames.some(frame => frame.opacity > 0 && frame.opacity < 1), "entry traverses intermediate opacity");
    assert.ok(frames.some(frame => frame.progress.some(progress => progress != null && progress > 0 && progress < 1)));
    const title = f.page.getByRole("textbox", { name: "Title", exact: true });
    await title.fill("Preserved draft");
    const original = await title.elementHandle();
    await f.page.setViewportSize({ width: 1600, height: 1000 });
    await f.page.locator('[data-adaptive-surface][data-presentation="docked"]').waitFor();
    assert.equal(await original!.evaluate(element => element.isConnected), true);
    assert.equal(await title.inputValue(), "Preserved draft");
    assert.deepEqual(await f.records(), []);
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});
