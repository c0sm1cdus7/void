import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { compile } from "desert-sdk/src/index.ts";
import { openLocalController } from "desert-sdk/src/local.ts";
import { postgresCluster } from "desert-sdk/src/testing/postgres-cluster.ts";
import { viewProgramActivities } from "desert-sdk/src/activities/presentation.ts";
import { VOID, VoidViewProgram, VoidProduct } from "../src/void.product.ts";

test("Guided note is an explicit additional experience using the existing create command", () => {
  const ordinary = VOID.journeys!.find(journey => journey.id === "create-note");
  const guided = VOID.journeys!.find(journey => journey.id === "guided-note");
  assert.ok(ordinary?.kind === "mutation" && guided?.kind === "mutation");
  assert.deepEqual(guided.command, ordinary.command, "no duplicate command or business rules");
  assert.equal(VoidViewProgram.journeys.find(journey => journey.id === "create-note")?.kind, "create");
  assert.equal(VoidViewProgram.journeys.find(journey => journey.id === "guided-note")?.kind, "activity");
  const application = compile(VoidProduct), human = application.surface("human");
  assert.equal(human.commit?.["create-note"], "submit");
  assert.equal(human.commit?.["guided-note"], "review");
  for (const surface of ["human", "agent"]) assert.ok(application.surface(surface).journeys.some(journey => journey.id === "guided-note"));
});

test("Guided note persists its steps and creates one private Note only after explicit acceptance", async t => {
  const application = compile(VoidProduct), catalog = viewProgramActivities(application, VoidViewProgram, "human");
  assert.ok(catalog);
  const experience = VoidViewProgram.journeys.find(journey => journey.id === "guided-note");
  assert.ok(experience?.kind === "activity");
  const cluster = postgresCluster(); t.after(() => cluster.dispose());
  const host = await openLocalController(application, { ...await cluster.database(), roles: ["notes"], activities: catalog });
  t.after(() => host.close());
  const owner = await host.identities.issue("Guided note witness"), human = host.connect(owner.token, "human");
  let activity = await human.activityCreate(randomUUID(), experience.activity);
  activity = await human.activityAnswer(activity.id, activity.revision, 0, { title: "" });
  const resumed = await host.connect(owner.token, "human").activityRead(activity.id);
  assert.equal(resumed.progress.nextStep, 1);
  assert.deepEqual(resumed.progress.input, { title: "" });
  activity = await human.activityAnswer(resumed.id, resumed.revision, 1, { body: "Collected through two steps." });
  const prepared = await human.activityPrepare(activity.id, activity.revision);
  assert.deepEqual(await human.read((await human.begin("read-notes")).id), []);
  const receipt = await human.accept(prepared.intent.id, prepared.intent.confirmationDigest);
  assert.deepEqual(await human.accept(prepared.intent.id, prepared.intent.confirmationDigest), receipt);
  const records = await human.read((await human.begin("read-notes", receipt.object.id)).id);
  assert.deepEqual(records[0]?.facts, { title: "", body: "Collected through two steps." });
  const outsider = await host.identities.issue("Another writer"), foreign = host.connect(outsider.token, "human");
  await assert.rejects(foreign.activityRead(activity.id), /NOT_FOUND/);
});
