import { readJourney } from "desert-sdk/src/index.ts";
import { Task } from "../task.object.ts";
import { TasksController } from "../tasks.dependencies.ts";

export const ReadTasks = readJourney("read-tasks", Task, {
  fields: ["title", "body", "projects", "status"], collection: ["title", "status"],
  requires: { controller: TasksController, dependencies: [] },
});
