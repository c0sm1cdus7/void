import assert from "node:assert/strict";
import test from "node:test";
import { compile } from "desert-sdk/src/index.ts";
import { openTasksTestHost, tasksTestProduct } from "./support/tasks-host.ts";

test("Tasks mounts independently and exposes the same canonical activities on both surfaces", () => {
  const product = tasksTestProduct();
  assert.deepEqual(product.catalog.modules, ["tasks"]);
  const application = compile(product);
  const activities = ["complete-task", "create-project", "create-task", "edit-task", "read-projects", "read-tasks", "reopen-task"];
  for (const surface of ["human", "agent"]) {
    assert.deepEqual(application.surface(surface).journeys.map(item => item.id).sort(), activities);
  }
  assert.deepEqual(product.viewProgram.objects?.find(object => object.object === 'task'), { object: "task", view: "task-detail",
    title: { object: "task", field: "title" }, actions: [
      { journey: "edit-task", icon: "edit" }, { journey: "reopen-task", icon: "retry", selection:{fact:{object:'task',field:'status'},value:'open',label:'Open'} },
      { journey: "complete-task", icon: "confirm", selection:{fact:{object:'task',field:'status'},value:'completed',label:'Completed'} },
    ] });
  assert.equal(product.viewProgram.objects?.find(object=>object.object==='project')?.view,'project-detail');
});

test("create, edit, complete and reopen preserve one task and enforce controller state", async t => {
  const host = await openTasksTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Task owner");
  const human = host.controller.connect(owner.token, "human");
  const agent = host.controller.connect(owner.token, "agent");
  const project=async(name:string)=>{const prepared=await human.prepare((await human.begin('create-project')).id,{name,color:'blue'});
    return (await human.accept(prepared.id,prepared.confirmationDigest)).object.id;};
  const desert=await project('Desert'),voidProject=await project('VOID'),lowerVoid=await project('void');
  const beforeTask=await host.snapshot();
  const create = await human.prepare((await human.begin("create-task")).id,
    { title: "Finish the vertical", body: "Preserve the existing catalog.", projects: [desert, voidProject] });
  assert.deepEqual(await host.snapshot(), beforeTask);
  const created = await human.accept(create.id, create.confirmationDigest);
  const id = created.object.id;
  const read = async () => human.read((await human.begin("read-tasks", id)).id);
  assert.deepEqual(await read(), [{ id, version: 1, facts: {
    title: "Finish the vertical", body: "Preserve the existing catalog.", projects: [desert, voidProject], status: "open",
  } }]);
  assert.equal((await human.offer("complete-task", id)).eligible, true);
  assert.equal((await human.offer("reopen-task", id)).eligible, false);
  const editRun = await agent.begin("edit-task", id);
  await assert.rejects(agent.prepare(editRun.id, { title: "Updated", body: "Details", projects: [voidProject, lowerVoid] }), /EDIT_BASE_REQUIRED/);
  const edit = await agent.prepare(editRun.id, { title: "Updated", body: "Details", projects: [voidProject, lowerVoid] }, { expectedVersion: 1 });
  await agent.accept(edit.id, edit.confirmationDigest);
  const complete = await human.prepare((await human.begin("complete-task", id)).id, {});
  const completed = await human.accept(complete.id, complete.confirmationDigest);
  assert.deepEqual(await human.accept(complete.id, complete.confirmationDigest), completed);
  assert.deepEqual(await read(), [{ id, version: 3, facts: { title: "Updated", body: "Details", projects: [voidProject, lowerVoid], status: "completed" } }]);
  assert.equal((await human.offer("complete-task", id)).eligible, false);
  assert.equal((await human.offer("reopen-task", id)).eligible, true);
  await assert.rejects(async () => human.prepare((await human.begin("complete-task", id)).id, {}), /PRECONDITION_FAILED/);
  const reopen = await agent.prepare((await agent.begin("reopen-task", id)).id, {});
  await agent.accept(reopen.id, reopen.confirmationDigest);
  assert.deepEqual(await read(), [{ id, version: 4, facts: { title: "Updated", body: "Details", projects: [voidProject, lowerVoid], status: "open" } }]);
  const snapshot = await host.snapshot();
  assert.equal(snapshot.objects.length, 4);
  assert.equal(snapshot.receipts.length, 7);
  assert.deepEqual(snapshot.objects.find(object=>object.object_type==='task')!.facts, { title: "Updated", body: "Details", projects: [voidProject, lowerVoid], status: "open", owner: owner.id });
});

test("private tasks reject foreign access, forged fields, and stale acceptance without effects", async t => {
  const host = await openTasksTestHost();
  t.after(() => host.close());
  const owner = await host.controller.identities.issue("Task concurrency owner");
  const human = host.controller.connect(owner.token, "human");
  for (const input of [
    { title: "", body: "No title", projects: [] }, { title: "Long".repeat(51), body: "Too long", projects: [] },
    { title: "Forbidden owner", body: "", projects: [], owner: owner.id }, { title: "Invalid status", body: "", projects: [], status: "completed" },
  ]) await assert.rejects(async () => human.prepare((await human.begin("create-task")).id, input));
  assert.deepEqual(await host.snapshot(), { objects: [], receipts: [] });
  const projectIntent=await human.prepare((await human.begin('create-project')).id,{name:'Private',color:'slate'});
  const privateProject=(await human.accept(projectIntent.id,projectIntent.confirmationDigest)).object.id;
  const create = await human.prepare((await human.begin("create-task")).id, { title: "Private task", body: "Secret", projects: [privateProject] });
  const { object: { id } } = await human.accept(create.id, create.confirmationDigest);
  const complete = await human.prepare((await human.begin("complete-task", id)).id, {});
  const edit = await human.prepare((await human.begin("edit-task", id)).id,
    { title: "Newest", body: "Secret", projects: [privateProject] }, { expectedVersion: 1 });
  await human.accept(edit.id, edit.confirmationDigest);
  await assert.rejects(human.accept(complete.id, complete.confirmationDigest), /VERSION_CONFLICT/);
  const before = await host.snapshot();
  const other = await host.controller.identities.issue("Other task identity");
  for (const exposure of ["human", "agent"]) {
    const session = host.controller.connect(other.token, exposure);
    assert.deepEqual(await session.read((await session.begin("read-tasks")).id), []);
    for (const journey of ["read-tasks", "edit-task", "complete-task", "reopen-task"]) {
      await assert.rejects(session.begin(journey, id), /NOT_FOUND/);
    }
  }
  assert.deepEqual(await host.snapshot(), before);
});
