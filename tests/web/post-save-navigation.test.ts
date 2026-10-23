import assert from "node:assert/strict";
import test from "node:test";
import type { Request } from "playwright";
import { browserFixture } from "./fixture.ts";

test("Media navigation survives a pending post-save read without a second click or replay", async () => {
  const f = await browserFixture();
  let releaseRead!: () => void, readEntered!: () => void;
  const heldRead = new Promise<void>(resolve => { readEntered = resolve; });
  const release = new Promise<void>(resolve => { releaseRead = resolve; });
  let accepted = false, held = false;
  let obsoleteRead: Request | undefined;
  const button = (name: string) => f.page.getByRole("button", { name, exact: true });
  f.page.on("response", response => {
    if (new URL(response.url()).pathname === "/api/accept") accepted = true;
  });
  try {
    await f.page.route("**/api/read", async route => {
      if (accepted && !held) { held = true; obsoleteRead = route.request(); readEntered(); await release; }
      await route.continue();
    });
    await button("Notes").click();
    await button("Create note").click();
    await f.page.getByRole("textbox", { name: "Title", exact: true }).fill("Navigation after a valid receipt");
    await f.page.getByRole("textbox", { name: "Content", exact: true }).fill("The read is not a pending write.");
    const receipt = f.page.waitForResponse(response => new URL(response.url()).pathname === "/api/accept");
    await button("Save note").click();
    assert.equal((await receipt).status(), 200);
    await f.page.getByRole("textbox", { name: "Title", exact: true }).waitFor({ state: "hidden" });
    await heldRead;
    const cancelledRead = f.page.waitForEvent("requestfailed", { predicate: request => request === obsoleteRead });
    await button("Media").click();
    await f.page.getByRole("main", { name: "Media", exact: true }).waitFor();
    await button("Add media").waitFor();
    assert.equal(await button("Media").getAttribute("aria-current"), "page");
    releaseRead();
    assert.match((await cancelledRead).failure()?.errorText ?? "", /aborted|cancelled/i);
    await f.page.getByRole("main", { name: "Media", exact: true }).waitFor();
    assert.equal(await f.page.locator("[data-media-viewer]").count(), 0,
      "The real private library never redirects to the retired illustrative gallery");
    assert.equal(await button("Media").getAttribute("aria-current"), "page");
    assert.equal(f.operations.filter(operation => operation.operation === "accept").length, 1);
    assert.equal((await f.records()).length, 1);
    assert.deepEqual(f.errors, []);
  } finally { releaseRead(); await f.close(); }
});
