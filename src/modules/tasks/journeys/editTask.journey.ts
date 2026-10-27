import { factReference, initializeInput, mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { EditTaskRecord } from "../commands/editTask.command.ts";
import { Task } from "../task.object.ts";
import { TasksController } from "../tasks.dependencies.ts";
import { TaskEditorView } from "../views/taskEditor.view.ts";
import { ReadTasks } from "./readTasks.journey.ts";

export const EditTask = mutationJourney("edit-task", EditTaskRecord, {
  controller: TasksController, dependencies: [],
});

export const EditTaskJourney = {
  id: EditTask.id, kind: "update", source: ReadTasks, view: TaskEditorView, preferredDock: "right",
  initialize: [
    initializeInput(EditTaskRecord, "title", factReference(Task, "title")),
    initializeInput(EditTaskRecord, "body", factReference(Task, "body")),
    initializeInput(EditTaskRecord, "projects", factReference(Task, "projects")),
  ],
  outputs: [
    { ...viewOutput(TaskEditorView, "save"), action: { kind: "submit" } },
    { ...viewOutput(TaskEditorView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
