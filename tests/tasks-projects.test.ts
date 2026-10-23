import assert from "node:assert/strict";
import test from "node:test";
import { openTasksTestHost } from "./support/tasks-host.ts";

test("Projects remain canonical owned references through prepare, accept, replay, edit and private reads", async t => {
  const host = await openTasksTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Project owner");
  const session = host.controller.connect(owner.token, "human");
  const names = ["🌵".repeat(64), "Void", "void"];
  const projects: string[] = [];
  for (const name of names) {
    const prepared = await session.prepare((await session.begin("create-project")).id, { name, color: "blue" });
    const created = await session.accept(prepared.id, prepared.confirmationDigest);
    assert.deepEqual(await session.accept(prepared.id, prepared.confirmationDigest), created);
    projects.push(created.object.id);
  }
  const before = await host.snapshot();
  const prepared = await session.prepare((await session.begin("create-task")).id,
    { title: "Typed projects", body: "", projects });
  assert.deepEqual(await host.snapshot(), before, "Preparing a task does not mutate its projects or create a task");
  const receipt = await session.accept(prepared.id, prepared.confirmationDigest);
  assert.deepEqual(await session.accept(prepared.id, prepared.confirmationDigest), receipt);
  const id = receipt.object.id;
  const read = () => session.begin("read-tasks", id).then(run => session.read(run.id));
  assert.deepEqual((await read())[0]!.facts.projects, projects);
  const empty = await session.prepare((await session.begin("edit-task", id)).id,
    { title: "Explicitly empty", body: "", projects: [] }, { expectedVersion: 1 });
  await session.accept(empty.id, empty.confirmationDigest);
  assert.deepEqual((await read())[0]!.facts.projects, []);
  const outsider = await host.controller.identities.issue("Not project owner");
  const foreign = host.controller.connect(outsider.token, "agent");
  assert.deepEqual(await foreign.read((await foreign.begin("read-tasks")).id), []);
  await assert.rejects(foreign.begin("read-tasks", id), /NOT_FOUND/);
  const projectRecords = await session.read((await session.begin("read-projects")).id);
  assert.deepEqual(projectRecords.map(record => record.facts.name).sort(), [...names].sort());
  assert.equal((await host.snapshot()).receipts.length, 5);
});

test("Project references reject scalar encodings, missing input and label strings before effects", async t => {
  const host = await openTasksTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Project validation owner");
  const session = host.controller.connect(owner.token, "agent");
  const invalid: unknown[] = [null, "Void", '[]', 0, [""], [" "], [" Void"], ["Void "],
    ["Void", "Void"], ["🌵".repeat(65)], Array.from({ length: 13 }, (_, index) => `Project ${index}`)];
  for (const projects of invalid) {
    await assert.rejects(session.prepare((await session.begin("create-task")).id,
      { title: "Rejected projects", body: "", projects }));
  }
  await assert.rejects(session.prepare((await session.begin("create-task")).id, { title: "Missing projects", body: "" }));
  assert.deepEqual(await host.snapshot(), { objects: [], receipts: [] });
});
