import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { chromium, type Page } from "playwright";
import { compile } from "desert-sdk/src/index.ts";
import { openControllerHost } from "desert-sdk/src/local/controller-host.ts";
import { serveBuiltIdentitySurface } from "desert-sdk/src/build/serve.ts";
import { VoidProduct, VoidViewProgram } from "../../src/void.product.ts";
import { Dependencies } from "../../src/modules.ts";
import { VoidHumanExposure } from "../../src/exposures.ts";
import { CreateNote } from "../../src/modules/notes/journeys/createNote.journey.ts";
import { ReadNotes } from "../../src/modules/notes/journeys/readNotes.journey.ts";
import { localMedia } from "../../scripts/local-media.ts";
import { privateImages } from "../../scripts/private-images.ts";
import { VoidInstallation } from "../../installation.ts";
import { compileViewProgram } from "desert-sdk/src/views/program.ts";
import { productViewProgram } from "desert-sdk/src/modules/compiled-product.ts";
import { GuidedNote } from "../../src/modules/notes/journeys/guidedNote.journey.ts";

const password = "An isolated two-tab test password";
const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
function deferred<T>() {
  let resolve!: (value: T) => void, reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
async function signIn(page: Page, login: string) {
  if (await button(page, "Use another identity").count()) await button(page, "Use another identity").click();
  await page.getByLabel("Identity name", { exact: true }).fill(login);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await button(page, "Unlock").click();
  await page.locator('[role="main"][data-destination="home"]').waitFor();
}

test("another tab's sign-in cannot inherit a prepared activity or publish a late response under a different identity", { timeout: 60000 }, async () => {
  assert.ok(process.env.VOID_WEB_BUILD, "VOID_WEB_BUILD_REQUIRED");
  const directory = mkdtempSync(join(tmpdir(), "void-identity-tabs-"));
  const application = compile(VoidProduct);
  const browser = await chromium.launch({ headless: true });
  let host: Awaited<ReturnType<typeof openControllerHost>> | undefined;
  let server: Awaited<ReturnType<typeof serveBuiltIdentitySurface>> | undefined;
  let releasePrepare = () => {};
  let releaseAccess = () => {};
  try {
    host = await openControllerHost({ application,
      roles: [Dependencies.notes.id, Dependencies.tasks.id, Dependencies.media.id],
      installation: VoidInstallation, surfaceId: VoidHumanExposure.id, directory, privateImages: privateImages(directory) });
    const administrator = await host.controller.access.initialize({ login: "identity-a", displayName: "Identity A", password });
    await host.controller.access.createIdentity(administrator.token, { login: "identity-b", displayName: "Identity B", password });
    const member = await host.controller.access.signIn({ login: "identity-b", password });
    const sessionA = host.controller.connect(administrator.token, VoidHumanExposure.id);
    const sessionB = host.controller.connect(member.token, VoidHumanExposure.id);
    const program = compileViewProgram(productViewProgram(application), application.surface(VoidHumanExposure.id));
    const guided = program.journeys.find(journey => journey.id === GuidedNote.id);
    assert.ok(guided?.kind === "activity");
    await sessionA.activityCreate(randomUUID(), guided.activity);
    const seed = await sessionB.prepare((await sessionB.begin(CreateNote.id)).id,
      { title: "Only identity B can see this note", body: "Private B witness" });
    await sessionB.accept(seed.id, seed.confirmationDigest);
    server = await serveBuiltIdentitySurface({ controller: host.controller, surface: VoidHumanExposure.id,
      buildDirectory: resolve(process.env.VOID_WEB_BUILD), port: 0, ...localMedia(VoidViewProgram) });
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
    const pageA = await context.newPage(), pageB = await context.newPage();
    const errors: string[] = [];
    for (const page of [pageA, pageB]) {
      page.setDefaultTimeout(10000);
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(server.origin);
      await button(page, "Unlock").waitFor();
    }
    // Keep the second tab's real sign-in screen open while a background status request is delayed.
    // The sign-in and every domain operation still go to the real protected controller.
    const accessRelease = new Promise<void>(resolve => { releaseAccess = resolve; });
    await pageB.route("**/api/accessState", async route => { await accessRelease; await route.abort(); });
    await signIn(pageA, "identity-a");
    await button(pageA, "Notes").click();
    assert.equal(await button(pageA, "Only identity B can see this note").count(), 0);
    assert.equal(await button(pageA, "Guided note").count(), 0, "Notes has only its one-step creation entry");
    await button(pageA, "Home").click();
    await pageA.locator('[role="main"][data-destination="home"]').getByRole('button', { name: /Guided note/ }).click();
    const panel = pageA.locator("[data-adaptive-surface]");
    await panel.getByRole("textbox", { name: "Title", exact: true }).fill("Identity A's uncommitted draft");
    await panel.getByRole("button", { name: "Continue", exact: true }).click();
    await panel.getByRole("textbox", { name: "Content", exact: true }).fill("Must never execute as B");
    const journalKey = `desert.activity/${application.digest}/${VoidHumanExposure.id}/identity/${administrator.identity.id}`;
    const journalBefore = await pageA.evaluate(key => sessionStorage.getItem(key), journalKey);
    assert.ok(journalBefore, "the real activity has an identity-scoped persisted journal");
    const prepared = deferred<{ binding: string; intentId: string; confirmationDigest: string }>();
    const prepareRelease = new Promise<void>(resolve => { releasePrepare = resolve; });
    const delivered = deferred<void>();
    void delivered.promise.catch(() => {});
    await pageA.route("**/api/activityPrepare", async route => {
      try {
        const response = await route.fetch();
        assert.equal(response.status(), 200);
        const value = await response.json();
        const binding = await route.request().headerValue("x-desert-session");
        assert.ok(binding, "protected requests carry the mounted session binding");
        prepared.resolve({ binding, intentId: value.intent.id, confirmationDigest: value.intent.confirmationDigest });
        await prepareRelease;
        await route.fulfill({ response });
        delivered.resolve();
      } catch (error) { prepared.reject(error); delivered.reject(error); }
    });
    await panel.getByRole("button", { name: "Continue", exact: true }).click();
    const held = await prepared.promise;
    await signIn(pageB, "identity-b");
    await button(pageA, "Unlock").waitFor();
    assert.equal(await pageA.locator("[data-workspace]").count(), 0,
      "the previous identity's mounted workspace is removed, not silently rebound to the new cookie");
    const headers = { "Content-Type": "application/json", "Origin": server.origin,
      "X-Desert-Contract": application.digest, "X-Desert-Session": held.binding };
    const deniedAccept = await context.request.post(`${server.origin}/api/accept`, { headers,
      data: { intentId: held.intentId, confirmationDigest: held.confirmationDigest } });
    assert.equal(deniedAccept.status(), 401, "the old mounted session cannot write through the newly shared B cookie");
    assert.deepEqual(await deniedAccept.json(), { error: "BROWSER_SESSION_CHANGED" });
    const deniedRead = await context.request.post(`${server.origin}/api/begin`, { headers, data: { journeyId: ReadNotes.id } });
    assert.equal(deniedRead.status(), 401, "the old session cannot start a read of B's private records either");
    assert.deepEqual(await deniedRead.json(), { error: "BROWSER_SESSION_CHANGED" });
    releasePrepare();
    await delivered.promise;
    await pageA.waitForFunction(() => !document.querySelector("[data-workspace]"));
    assert.equal(await pageA.locator("[data-workspace]").count(), 0);
    assert.equal(await pageA.getByText("Review · Guided note", { exact: true }).count(), 0);
    assert.equal(await pageA.getByText("Private B witness", { exact: true }).count(), 0);
    assert.equal(await pageA.evaluate(key => sessionStorage.getItem(key), journalKey), journalBefore,
      "identity A's journal survives disposal without becoming identity B's activity");
    assert.deepEqual(await sessionA.read((await sessionA.begin(ReadNotes.id)).id), []);
    assert.equal((await sessionB.read((await sessionB.begin(ReadNotes.id)).id)).length, 1);
    await button(pageB, "Notes").click();
    await button(pageB, "Only identity B can see this note").waitFor();
    assert.equal(await button(pageB, "Identity A's uncommitted draft").count(), 0);
    assert.deepEqual(errors, []);
  } finally {
    releasePrepare(); releaseAccess();
    await browser.close(); await server?.close(); await host?.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
