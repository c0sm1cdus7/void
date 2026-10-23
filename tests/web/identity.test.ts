import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { compile } from "desert-sdk/src/index.ts";
import { serveIdentityHost } from "desert-sdk/src/local/identity-host.ts";
import { VoidViewProgram, VoidProduct } from "../../src/void.product.ts";
import { Dependencies } from "../../src/modules.ts";
import { VoidHumanExposure } from "../../src/exposures.ts";
import { localMedia } from "../../scripts/local-media.ts";
import { privateImages } from "../../scripts/private-images.ts";
import { choosePrivateImage } from "./media-ui.ts";

test("the real protected VOID build persists private Notes and images, locks offline and unlocks at compact width", async () => {
  assert.ok(process.env.VOID_WEB_BUILD, "VOID_WEB_BUILD_REQUIRED");
  const directory = mkdtempSync(join(tmpdir(), "void-protected-browser-"));
  const browser = await chromium.launch({ headless: true });
  let host: Awaited<ReturnType<typeof serveIdentityHost>> | undefined;
  try {
    host = await serveIdentityHost({ application: compile(VoidProduct),
      roles: [Dependencies.notes.id, Dependencies.tasks.id, Dependencies.media.id], surfaceId: VoidHumanExposure.id,
      directory, privateImages: privateImages(directory), buildDirectory: resolve(process.env.VOID_WEB_BUILD), port: 0,
      ...localMedia(VoidViewProgram) });
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(JSON.parse(readFileSync(host.launchFile, "utf8")).url);
    const button = (name: string) => page.getByRole("button", { name, exact: true });
    const field = (name: string) => page.getByLabel(name, { exact: true });
    const evidence = fileURLToPath(new URL("../../.local/web-evidence/", import.meta.url));
    mkdirSync(evidence, { recursive: true });
    async function capture(name: string) {
      for (const width of [1600, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.screenshot({ path: join(evidence, `${name}-${width}.png`), fullPage: true });
      }
      await page.setViewportSize({ width: 1600, height: 1000 });
    }
    await button("Continue").waitFor();
    assert.equal(await page.locator("[data-workspace]").count(), 0);
    await field("Display name").fill("Isolated test administrator");
    await field("Identity name").fill("test-admin");
    await field("Password").fill("A temporary test password");
    assert.equal(await field("Confirm password").count(), 0);
    assert.equal(await page.locator("[data-avatar-seed]").count(), 1);
    const beforeSeed = await page.locator("[data-avatar-seed]").getAttribute("data-avatar-seed");
    await button("Shuffle avatar").click();
    const avatarSeed = await page.locator("[data-avatar-seed]").getAttribute("data-avatar-seed");
    assert.notEqual(avatarSeed, beforeSeed);
    assert.equal(await page.locator("[data-avatar-seed] text").count(), 0);
    await capture("access-identity");
    await button("Continue").click();
    assert.equal(await page.getByText("Tint", { exact: true }).count(), 1);
    assert.equal(await page.locator('input[type="file"]').count(), 0);
    assert.equal(await button("Get started").locator("svg").count(), 0);
    assert.equal(await button("Text size · Default").getAttribute("data-material"), "pane");
    await page.getByRole("radio", { name: "Rose", exact: true }).click();
    await page.getByRole("radio", { name: "Mist", exact: true }).click();
    await capture("access-personalization");
    await button("Get started").click();
    await page.locator('[role="main"][data-destination="home"]').waitFor();
    await button("Create note").click();
    await field("Title").fill("Protected persistence witness");
    await field("Content").fill("Private content survives sign-in, not an abandoned draft.");
    await button("Save note").click();
    await field("Title").waitFor({ state: "hidden" });
    await button("Media").click();
    const mediaPanel = await choosePrivateImage(page);
    await mediaPanel.getByRole("button", { name: "Add media", exact: true }).click();
    await mediaPanel.locator('[data-media-object] [data-image-state="ready"]').waitFor();
    const blob = await mediaPanel.locator('[data-media-object] img').getAttribute("src");
    assert.ok(blob);
    assert.ok(blob?.startsWith("blob:"));
    const decodes = () => page.evaluate(async url => {
      const image = new Image(); image.src = url!;
      try { await image.decode(); return true; } catch { return false; }
    }, blob);
    assert.equal(await decodes(), true);
    await mediaPanel.getByRole("button", { name: "Close", exact: true }).first().click();
    await mediaPanel.waitFor({ state: "hidden" });
    assert.equal(await decodes(), false, "closing the transient image context must revoke its private browser URL");
    await button("Identity").click();
    assert.equal(await decodes(), false, "leaving the image context must revoke its private browser URL");
    await page.getByText("Isolated test administrator", { exact: true }).waitFor();
    await page.route("**/api/lock", route => route.abort());
    await button("Lock VOID").click();
    await page.getByText(/Could not confirm revocation/).waitFor();
    assert.equal(await page.evaluate(async () => (await (await fetch("/api/accessState")).json()).kind), "ready",
      "the server cookie is intentionally still valid; the local lock must protect reload");
    await page.reload();
    await button("Unlock").waitFor();
    assert.equal(await page.locator("[data-workspace]").count(), 0);
    assert.equal(await page.locator("[data-avatar-seed]").getAttribute("data-avatar-seed"), avatarSeed);
    assert.equal(await page.getByText("Your private workspace.", { exact: true }).count(), 0);
    assert.equal(await page.getByText(/Proposed next step/).count(), 0);
    await page.unroute("**/api/lock");
    await page.setViewportSize({ width: 390, height: 844 });
    await button("Use another identity").click();
    await field("Identity name").fill("test-admin");
    await field("Password").fill("A temporary test password");
    await button("Unlock").click();
    await page.locator('[role="main"][data-destination="home"]').waitFor();
    await page.setViewportSize({ width: 1600, height: 1000 });
    await button("Notes").click();
    await page.getByRole("button", { name: /Protected persistence witness/ }).click();
    await page.getByText("Private content survives sign-in, not an abandoned draft.", { exact: true }).waitFor();
    await button("Media").click();
    await page.locator('[data-media-grid-item]').click();
    await mediaPanel.locator('[data-media-object] [data-image-state="ready"]').waitFor();
    await mediaPanel.getByRole("button", { name: "Close", exact: true }).first().click();
    await button("Identity").click();
    await button("Lock VOID").click();
    await button("Unlock").waitFor();
    await capture("access-lock");
    assert.equal(await page.evaluate(async () => (await fetch("/api/availability")).status), 401);
    const second = await context.newPage();
    await second.goto(host.origin);
    await second.getByRole("button", { name: "Unlock", exact: true }).waitFor();
    assert.equal(await second.locator("[data-workspace]").count(), 0);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    await host?.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
