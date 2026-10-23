import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture, settleMotion } from "./fixture.ts";

for (const width of [390, 1600]) for (const colorScheme of ["light", "dark"] as const) {
  test(`Notes uses shared primary glass without changing neutral panes at ${width}px/${colorScheme}`, async () => {
    const f = await browserFixture();
    try {
      await f.page.setViewportSize({ width, height: 844 });
      await f.page.emulateMedia({ colorScheme });
      await f.page.getByRole("button", { name: "Create note", exact: true }).click();
      const save = f.page.getByRole("button", { name: "Save note", exact: true });
      await save.waitFor();
      await settleMotion(f.page);
      const paint = await save.evaluate(element => {
        const surface = element.closest<HTMLElement>("[data-adaptive-surface]")!;
        const close = surface.querySelector('[data-surface-slot="top"] [data-toolbar-navigation] button')!;
        const well = surface.querySelector(".field-well")!;
        const style = (node: Element) => {
          const computed = getComputedStyle(node);
          const canvas = new OffscreenCanvas(1, 1), context = canvas.getContext("2d")!;
          context.fillStyle = computed.backgroundColor; context.fillRect(0, 0, 1, 1);
          return { fill: computed.backgroundColor, color: computed.color,
            blur: computed.backdropFilter, border: computed.borderWidth,
            alpha: context.getImageData(0, 0, 1, 1).data[3]! / 255 };
        };
        return { save: style(element), close: style(close), well: style(well), surface: style(surface),
          saveHeight: element.getBoundingClientRect().height, closeHeight: close.getBoundingClientRect().height };
      });
      assert.notEqual(paint.save.fill, paint.close.fill, "primary emphasis belongs to the glass background");
      assert.equal(paint.save.color, "rgb(255, 255, 255)");
      assert.match(paint.save.blur, /blur\(/);
      assert.equal(paint.saveHeight, paint.closeHeight, "primary emphasis must not change button geometry");
      for (const neutral of [paint.close, paint.well, paint.surface]) {
        assert.equal(neutral.fill, paint.close.fill, "all neutral panes share one material");
        assert.equal(neutral.blur, paint.save.blur, "primary tint must not replace the shared glass effect");
        assert.equal(neutral.border, paint.save.border);
        assert.ok(neutral.alpha > 0 && neutral.alpha < 1);
        assert.equal(neutral.alpha, paint.save.alpha, "tint must not introduce a new opacity recipe");
      }
      await f.screenshot(`notes-primary-glass-${width}-${colorScheme}`);
      assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });
}
