import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Page } from "playwright";
import { compile } from "desert-sdk/src/index.ts";
import { openDeveloperHost } from "desert-sdk/src/local/developer-host.ts";
import { serveBuiltLocalSurface } from "desert-sdk/src/build/serve.ts";
import { VOID } from "../../product.ts";
import { NotesController } from "../../dependencies.ts";
import { HumanNotes } from "../../surfaces.ts";
import { ReadNotes } from "../../journeys/readNotes.journey.ts";

type Operation = { operation: "begin" | "prepare" | "accept"; input: Record<string, unknown> };

export async function settleMotion(page: Page) {
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations()
      .filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {})));
  });
}

export async function browserFixture() {
  if (!process.env.VOID_WEB_BUILD) throw new Error("VOID_WEB_BUILD_REQUIRED: supply the real VOID web build directory");
  const directory = mkdtempSync(join(tmpdir(), "void-browser-"));
  const cleanup: (() => void | Promise<void>)[] = [() => rmSync(directory, { recursive: true, force: true })];
  async function close() {
    const failures: unknown[] = [];
    for (const dispose of cleanup.splice(0).reverse()) {
      try { await dispose(); } catch (error) { failures.push(error); }
    }
    if (failures.length) throw new AggregateError(failures, "VOID_BROWSER_CLEANUP_FAILED");
  }
  try {
    const host = await openDeveloperHost({ application: compile(VOID), role: NotesController.id,
      surfaceId: HumanNotes.id, directory });
    cleanup.push(() => host.close());
    const server = await serveBuiltLocalSurface({ session: host.session,
      buildDirectory: resolve(process.env.VOID_WEB_BUILD), port: 0 });
    cleanup.push(() => server.close());
    const browser = await chromium.launch({ headless: true });
    cleanup.push(() => browser.close());
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors: string[] = [];
    const operations: Operation[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error" && /Content Security Policy|unsafe-eval/.test(message.text())) errors.push(message.text());
    });
    page.on("request", request => {
      const operation = new URL(request.url()).pathname.slice("/api/".length);
      if (["begin", "prepare", "accept"].includes(operation) && request.method() === "POST") {
        operations.push({ operation: operation as Operation["operation"], input: request.postDataJSON() });
      }
    });
    await page.goto(server.launchUrl);
    await page.getByRole("main", { name: "Home", exact: true }).waitFor();
    async function records() {
      const list = await host.session.read((await host.session.begin(ReadNotes.id)).id);
      return Promise.all(list.map(async record =>
        (await host.session.read((await host.session.begin(ReadNotes.id, record.id)).id))[0]!));
    }
    async function screenshot(name: string) {
      const output = fileURLToPath(new URL("../../.local/web-evidence/", import.meta.url));
      mkdirSync(output, { recursive: true });
      await settleMotion(page);
      await page.screenshot({ path: join(output, `${name}.png`), fullPage: true });
    }
    return { page, context, errors, operations, records, screenshot, host, close };
  } catch (error) {
    try { await close(); } catch (cleanupError) { throw new AggregateError([error, cleanupError], "VOID_BROWSER_SETUP_FAILED"); }
    throw error;
  }
}
