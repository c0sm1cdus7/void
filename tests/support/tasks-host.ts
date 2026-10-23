import { agentExposure, compile, composeProduct, humanExposure, moduleIndex } from "desert-sdk/src/index.ts";
import { localPostgresTestHost } from "desert-sdk/src/testing/postgres.ts";
import { TasksModule } from "../../src/modules/tasks/tasks.module.ts";
import { WorkspaceView } from "../../src/views/workspace.view.ts";
import { NavigationView } from "../../src/views/navigation.view.ts";

export function tasksTestProduct() {
  const modules = moduleIndex([TasksModule]);
  const journeys = Object.values(modules.journeys);
  return composeProduct({
    id: "tasks-witness", label: "Tasks witness", modules,
    views: [WorkspaceView, NavigationView], workspace: WorkspaceView,
    exposures: [humanExposure({ id: "human", journeys, locale: "en" }), agentExposure("agent", journeys)],
    entry: modules.destinations.Tasks,
    navigation: [{ destination: modules.destinations.Tasks, group: "Explore", purpose: "content" }],
  });
}

export async function openTasksTestHost() {
  const product = tasksTestProduct();
  const host = localPostgresTestHost()();
  try {
    const sandbox = await host.open(compile(product), "tasks");
    return { ...sandbox, async close() { try { await sandbox.close(); } finally { await host.close(); } } };
  } catch (error) { await host.close(); throw error; }
}
