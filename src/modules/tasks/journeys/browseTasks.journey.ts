import { viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { TasksView } from "../views/tasksHome.view.ts";
import { TaskDetailView } from "../views/taskDetail.view.ts";
import { CreateTask } from "./createTask.journey.ts";
import { CreateProject } from "./createProject.journey.ts";
import { ReadTasks } from "./readTasks.journey.ts";
export { ReadTasks } from "./readTasks.journey.ts";

export const ReadTasksExperience = {
  id: ReadTasks.id, kind: "read", view: TasksView, detailView: TaskDetailView,
  referenceCreation: "separate",
  outputs: [
    { ...viewOutput(TasksView, "create"), action: { kind: "journey", journey: CreateTask } },
    { ...viewOutput(TasksView, "createProject"), action: { kind: "journey", journey: CreateProject } },
    { ...viewOutput(TasksView, "select"), action: { kind: "select" } },
    { ...viewOutput(TaskDetailView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
