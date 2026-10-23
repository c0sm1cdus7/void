import assert from "node:assert/strict";
import test from "node:test";
import { CreateNote } from "../../src/modules/notes/journeys/createNote.journey.ts";
import { browserFixture } from "./fixture.ts";

test("a pending collection read shows a skeleton, never a premature empty state", async () => {
  const f = await browserFixture();
  let releaseRead!: () => void;
  const readGate = new Promise<void>(resolve => { releaseRead = resolve; });
  let heldReads = 0;
  try {
    await f.page.route("**/api/read", async route => {
      heldReads += 1;
      await readGate;
      await route.continue();
    });
    await f.page.reload();
    await f.page.getByRole("button", { name: "Notes", exact: true }).click();
    const main = f.page.getByRole("main", { name: "Notes", exact: true });
    const collection = main.getByRole("group", { name: "All notes", exact: true });
    const pending = collection.locator('[data-collection-state="loading"]');
    await pending.waitFor();
    assert.equal(await pending.getAttribute("aria-busy"), "true");
    assert.ok(await pending.locator('[data-slot="skeleton"]').count() > 0,
      "an unread collection has visible structural placeholders");
    assert.equal(await collection.getByText("Nothing here yet.", { exact: true }).count(), 0,
      "pending is not evidence that the collection is empty");
    assert.ok(heldReads > 0, "the fixture really has an outstanding controller read");
    await f.screenshot("notes-read-pending");

    const response = f.page.waitForResponse(item => new URL(item.url()).pathname === "/api/read");
    releaseRead();
    assert.equal((await response).status(), 200);
    await collection.locator('[data-collection-state="empty"]').waitFor();
    await collection.getByRole("heading", { name: "Nothing here yet.", exact: true }).waitFor();
    assert.equal(await collection.locator('[data-slot="skeleton"]').count(), 0);
    assert.equal(await collection.locator('[data-collection-state="empty"]').getAttribute("aria-busy"), "false");
    assert.equal(f.operations.filter(item => item.operation === "prepare" || item.operation === "accept").length, 0);
    await f.screenshot("notes-read-known-empty");
    assert.deepEqual(f.errors, []);
  } finally {
    releaseRead();
    await f.page.unrouteAll({ behavior: "wait" });
    await f.close();
  }
});

test("controller loss preserves read notes and disables creation; reconnect never replays a command", async () => {
  const f = await browserFixture();
  try {
    // Canonical writes are confined to this fixture's temporary store, never the live preview.
    const facts = { title: "Connection witness", body: "Already read content stays available." };
    const run = await f.host.session.begin(CreateNote.id);
    const intent = await f.host.session.prepare(run.id, facts);
    await f.host.session.accept(intent.id, intent.confirmationDigest);
    const before = await f.records();

    await f.page.getByRole("button", { name: "Notes", exact: true }).click();
    const main = f.page.getByRole("main", { name: "Notes", exact: true });
    const collection = main.getByRole("group", { name: "All notes", exact: true });
    const row = collection.getByRole("button", { name: facts.title, exact: true });
    await row.click();
    const body = f.page.getByText(facts.body, { exact: true });
    await body.waitFor();
    const create = f.page.getByRole("button", { name: "Create note", exact: true });
    const waitForCreation = (disabled: boolean) => f.page.waitForFunction(expected =>
      document.querySelector<HTMLButtonElement>('button[aria-label="Create note"]')?.disabled === expected, disabled);
    await waitForCreation(false);
    const commands = () => f.operations.filter(item => item.operation === "prepare" || item.operation === "accept"
      || (item.operation === "begin" && item.input.journeyId === CreateNote.id));
    assert.deepEqual(commands(), [], "viewing seeded data never starts a create command");

    await f.page.route("**/api/availability", route => route.abort("connectionrefused"));
    await waitForCreation(true);
    assert.equal(await create.isDisabled(), true);
    assert.equal(await row.isVisible(), true, "a connection failure does not discard an already read collection");
    assert.equal(await body.isVisible(), true, "the selected note remains readable offline");
    assert.equal(await collection.locator('[data-collection-state="empty"], [data-collection-state="loading"]').count(), 0);
    assert.match(await create.getAttribute("title") ?? "", /controller.*unavailable|reconnect/i,
      "the disabled command explains how availability can recover");
    assert.deepEqual(commands(), []);
    await f.screenshot("notes-controller-unavailable");

    const recovered = f.page.waitForResponse(item => new URL(item.url()).pathname === "/api/availability" && item.ok());
    await f.page.unroute("**/api/availability");
    await recovered;
    await waitForCreation(false);
    // Observe another real availability cycle instead of sleeping or assuming recovery has settled.
    await f.page.waitForResponse(item => new URL(item.url()).pathname === "/api/availability" && item.ok());
    assert.equal(await create.isEnabled(), true);
    assert.equal(await row.isVisible(), true);
    assert.equal(await body.isVisible(), true);
    assert.deepEqual(commands(), [], "reconnection may refresh reads but must not begin, prepare, or accept a create command");
    assert.deepEqual(await f.records(), before, "read refresh and reconnect preserve the stored note and its revision");
    await f.screenshot("notes-controller-reconnected");
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});
