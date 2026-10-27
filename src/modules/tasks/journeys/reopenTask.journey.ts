import { mutationJourney, type ViewJourney } from "desert-sdk/src/index.ts";
import { ReopenTaskRecord } from "../commands/reopenTask.command.ts";
import { TasksController } from "../tasks.dependencies.ts";
import { ReadTasks } from "./readTasks.journey.ts";

export const ReopenTask = mutationJourney("reopen-task", ReopenTaskRecord, {
  controller: TasksController, dependencies: [],
});

export const ReopenTaskJourney = {
  id: ReopenTask.id, kind: "action", source: ReadTasks, outputs: [],
} satisfies ViewJourney;
