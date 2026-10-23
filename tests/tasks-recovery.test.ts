import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { openTasksTestHost } from "./support/tasks-host.ts";

test("task controller loss changes availability and recovery never replays a mutation", async t => {
  const host = await openTasksTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Task recovery owner");
  const session = host.controller.connect(owner.token, "human");
  const projectDraft = await session.prepare((await session.begin("create-project")).id,
    { name: "Reconnect", color: "blue" });
  const project = await session.accept(projectDraft.id, projectDraft.confirmationDigest);
  const projects = [project.object.id];
  const created = await session.prepare((await session.begin("create-task")).id,
    { title: "Survive reconnection", body: "One accepted task.", projects });
  const receipt = await session.accept(created.id, created.confirmationDigest);
  const pending = await session.prepare((await session.begin("complete-task", receipt.object.id)).id, {});
  const observation = session.watchAvailability({ pollIntervalMs: 30, validForMs: 300 });
  t.after(() => observation.dispose());
  async function until(ready: boolean) {
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      if (observation.snapshot().journeys["create-task"]?.dependenciesReady === ready) return;
      await delay(30);
    }
    assert.fail(`Task availability did not become ${ready ? "ready" : "unavailable"}`);
  }
  await until(true);
  const before = await host.snapshot();
  host.stop();
  await until(false);
  host.start();
  await until(true);
  assert.deepEqual(await session.receipt(created.id), receipt);
  assert.deepEqual(await session.accept(created.id, created.confirmationDigest), receipt);
  assert.equal(await session.receipt(pending.id), null, "Recovery cannot accept a prepared transition");
  assert.deepEqual(await session.read((await session.begin("read-tasks", receipt.object.id)).id), [{
    id: receipt.object.id, version: 1,
    facts: { title: "Survive reconnection", body: "One accepted task.", projects, status: "open" },
  }]);
  assert.deepEqual(await host.snapshot(), before);
});
