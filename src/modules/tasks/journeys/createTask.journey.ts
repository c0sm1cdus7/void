import { mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { CreateTaskRecord } from "../commands/createTask.command.ts";
import { TasksController } from "../tasks.dependencies.ts";
import { TaskEditorView } from "../views/taskEditor.view.ts";
import { ReadTasks } from "./readTasks.journey.ts";

export const CreateTask = mutationJourney("create-task", CreateTaskRecord, {
  controller: TasksController, dependencies: [],
});

export const CreateTaskExperience = {
  id: CreateTask.id, kind: "create", source: ReadTasks, view: TaskEditorView, preferredDock: "right",
  outputs: [
    { ...viewOutput(TaskEditorView, "save"), action: { kind: "submit" } },
    { ...viewOutput(TaskEditorView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
