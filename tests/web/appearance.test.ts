import test from "node:test";
import assert from "node:assert/strict";
import { browserFixture, settleMotion } from "./fixture.ts";

test("Appearance changes the real workspace and catalog without executing product commands", async () => {
  const browser = await browserFixture();
  const { page } = browser;
  try {
    await page.getByRole("button", { name: "Appearance", exact: true }).click();
    await page.getByRole("main", { name: "Appearance", exact: true }).waitFor();
    await page.getByRole("radio", { name: "Light", exact: true }).click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    assert.equal(await page.getByRole("button", { name: "Text size · Default", exact: true }).getAttribute("data-material"), "pane");
    await page.getByRole("button", { name: "Text size · Default", exact: true }).click();
    await page.getByRole("option", { name: "Larger", exact: true }).click();
    await page.getByRole("radio", { name: "Rose", exact: true }).click();
    await page.getByRole("radio", { name: "Mist", exact: true }).click();
    assert.equal(await page.locator(".required").count(), 0);
    await page.getByRole("button", { name: "Visual catalog", exact: true }).click();
    await page.getByRole("main", { name: "Visual catalog", exact: true }).waitFor();
    assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--text-scale")), "1.3");
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    await page.getByRole("button", { name: "Appearance", exact: true }).click();
    assert.equal((await page.getByRole("button", { name: "Text size · Larger", exact: true }).locator('[data-field-value]').textContent())?.trim(), "Larger");
    assert.equal(await page.getByRole("button", { name: "Text size · Larger", exact: true }).getAttribute("data-material"), "pane");
    assert.equal(await page.getByRole("radio", { name: "Rose", exact: true }).isChecked(), true);
    assert.equal(await page.getByRole("radio", { name: "Mist", exact: true }).isChecked(), true);
    await browser.screenshot("appearance-light-larger");
    await page.getByRole("radio", { name: "Dark", exact: true }).click();
    await page.getByRole("button", { name: "Text size · Larger", exact: true }).click();
    await page.getByRole("option", { name: "Default", exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await settleMotion(page);
    await browser.screenshot("appearance-compact-dark");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(browser.operations.filter(operation => operation.operation !== "begin"), []);
    assert.ok(browser.operations.every(operation =>
      ["read-notes", "read-tasks", "read-projects"].includes(String(operation.input.journeyId))),
    "Home may start its authorized reads; appearance never starts a product mutation");
    assert.deepEqual(browser.errors, []);
  } finally { await browser.close(); }
});
