import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture } from "./fixture.ts";

test("System observes grouped controller availability without initiating mutations", async () => {
  const f = await browserFixture();
  try {
    await f.page.getByRole("button", { name: "System", exact: true }).click();
    const main = f.page.getByRole("main", { name: "System", exact: true });
    await main.waitFor();
    await main.getByRole("heading", { name: "Execution dependencies", exact: true }).waitFor();
    const dependencies=main.getByRole('group',{name:'Execution dependencies',exact:true});
    assert.equal(await dependencies.locator('.bank-stack').count(),1,'related controller rows share one pane');
    assert.equal(await dependencies.locator('.fact-row').count(),3);
    await main.getByText("Available", { exact: true }).first().waitFor();
    await main.getByRole("heading", { name: "Exposed operations", exact: true }).waitFor();
    await main.getByText("Create note", { exact: true }).waitFor();
    await main.getByText("Create task", { exact: true }).waitFor();
    await main.getByText("Contract digest", { exact: true }).waitFor();
    await f.screenshot("system-connected");
    const assertReadOnly=()=>{
      for(const operation of f.operations) {
        assert.equal(operation.operation,'begin','observation never prepares or accepts a mutation');
        assert.ok(['read-projects','read-notes','read-tasks'].includes(String(operation.input.journeyId)),
          'only the canonical Home and project-reference reads may start during application entry');
      }
    };
    assertReadOnly();
    await f.page.route("**/api/availability", route => route.abort("connectionrefused"));
    await main.getByText("Controller unreachable", { exact: true }).first().waitFor();
    assert.equal(await main.getByText("Available", { exact: true }).count(), 0);
    assert.equal(await main.getByText("Dependencies available", { exact: true }).count(), 0);
    await f.page.setViewportSize({ width: 390, height: 844 });
    await f.screenshot("system-unreachable-compact");
    await f.page.unroute("**/api/availability");
    await main.getByText("Available", { exact: true }).first().waitFor();
    await f.host.close();
    await main.getByText("Observation stopped", { exact: true }).first().waitFor();
    assert.equal(await main.getByText("Available", { exact: true }).count(), 0);
    assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assertReadOnly();
    assert.deepEqual(f.errors, []);
  } finally { await f.close(); }
});
