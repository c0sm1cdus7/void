import { mutationJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { CompleteTaskRecord } from "../commands/completeTask.command.ts";
import { TasksController } from "../tasks.dependencies.ts";
import { ReadTasks } from "./readTasks.journey.ts";

export const CompleteTask = mutationJourney("complete-task", CompleteTaskRecord, {
  controller: TasksController, dependencies: [],
});

export const CompleteTaskExperience = {
  id: CompleteTask.id, kind: "action", source: ReadTasks, outputs: [],
} satisfies ViewJourney;
