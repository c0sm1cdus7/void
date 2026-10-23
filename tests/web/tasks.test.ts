import assert from "node:assert/strict";
import test from "node:test";
import { browserFixture, settleMotion } from "./fixture.ts";

for (const width of [390, 1600]) {
  test(`Tasks uses canonical projects and a reversible status selector at ${width}px`, async () => {
    const f = await browserFixture();
    try {
      const button = (name: string) => f.page.getByRole("button", { name, exact: true });
      await button("Tasks").click();
      await f.page.getByRole("main", { name: "Tasks", exact: true }).waitFor();
      await f.page.setViewportSize({ width, height: 1000 });
      async function createProject(name: string) {
        await button("Create").click();
        await button("Create project").click();
        const editor=f.page.locator('[data-adaptive-surface]');
        await editor.getByRole("textbox", { name: "Name", exact: true }).fill(name);
        const save=editor.locator('[data-toolbar="top"]').getByRole('button',{name:'Save project',exact:true});
        assert.equal(await editor.locator('[data-toolbar="bottom"]').count(),0);
        await save.click();
        await editor.getByRole('button',{name:'Close',exact:true}).click();
        await f.page.getByRole('main',{name:'Tasks',exact:true}).waitFor();
      }
      await createProject("DESERT");
      await createProject("Two words 🪴");
      await createProject("VOID");
      await button("Create").click();
      await button("Create task").click();
      const panel = f.page.locator("[data-adaptive-surface]");
      const top = panel.locator('[data-surface-slot="top"]');
      const title = panel.getByRole("textbox", { name: "Title", exact: true });
      const body = panel.getByRole("textbox", { name: "Details", exact: true });
      await title.fill("Exercise the whole task");
      await body.fill("The same components, at every size.");
      assert.equal(await panel.locator('[data-toolbar="bottom"]').count(),0);
      assert.equal(await top.getByRole('button',{name:'Save task',exact:true}).locator('.lucide-check').count(),1);
      await panel.getByRole("button", { name: "Projects", exact: true }).click();
      assert.equal(await button("Create project").count(),0);
      await f.page.getByRole('checkbox',{name:'DESERT',exact:true}).check();
      await f.page.getByRole('checkbox',{name:'Two words 🪴',exact:true}).check();
      await f.page.keyboard.press("Escape");
      await f.screenshot(`task-editor-top-save-${width}`);
      await button("Save task").click();
      await top.getByText("Exercise the whole task", { exact: true }).waitFor();
      assert.equal(await top.getByRole("button", { name: "Complete task", exact: true }).count(), 0);
      assert.equal(await top.getByRole("button", { name: "Reopen task", exact: true }).count(), 0);
      await panel.getByRole("button", { name: "Status", exact: true }).waitFor();
      assert.equal(await panel.getByText("— Empty", { exact: true }).count(), 0);
      const initial = await f.host.session.read((await f.host.session.begin("read-tasks")).id);
      assert.equal(initial.length, 1);
      await top.getByRole("button", { name: "Edit task", exact: true }).click();
      assert.equal(await title.inputValue(), "Exercise the whole task");
      assert.equal(await body.inputValue(), "The same components, at every size.");
      await panel.getByRole("button", { name: "Projects", exact: true }).click();
      await f.page.getByRole("checkbox", { name: "DESERT", exact: true }).uncheck();
      await f.page.getByRole('checkbox',{name:'VOID',exact:true}).check();
      await f.page.keyboard.press("Escape");
      await title.fill("Verified task");
      await button("Save task").click();
      await top.getByText("Verified task", { exact: true }).waitFor();
      async function setStatus(label: string) {
        await panel.getByRole("button", { name: "Status", exact: true }).click();
        await f.page.getByRole("option", { name: label, exact: true }).click();
        await panel.getByRole("button", { name: "Status", exact: true }).filter({ hasText: label }).waitFor();
        await settleMotion(f.page);
      }
      await setStatus("Completed");
      await f.screenshot(`task-completed-${width}`);
      await setStatus("Open");
      const final = await f.host.session.read((await f.host.session.begin("read-tasks", initial[0]!.id)).id);
      const projects = await f.host.session.read((await f.host.session.begin("read-projects")).id);
      const selected = ["Two words 🪴", "VOID"].map(name => projects.find(project => project.facts.name === name)!.id);
      assert.deepEqual(final, [{ id: initial[0]!.id, version: 4, facts: {
        title: "Verified task", body: "The same components, at every size.", status: "open", projects: selected,
      } }]);
      assert.deepEqual(await f.records(), [], "Tasks must not create Notes");
      assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(f.errors, []);
    } finally { await f.close(); }
  });
}
