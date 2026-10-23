import { factReference, publishObject } from "desert-sdk/src/index.ts";
import { Task } from "./task.object.ts";
import { TaskDetailView } from "./views/taskDetail.view.ts";
import { EditTask } from "./journeys/editTask.journey.ts";
import { CompleteTask } from "./journeys/completeTask.journey.ts";
import { ReopenTask } from "./journeys/reopenTask.journey.ts";

export const PublishedTask = publishObject(Task, {
  view: TaskDetailView, title: factReference(Task, "title"),
  fields: [
    { fact: factReference(Task, "title"), label: "Title", representation: "text" },
    { fact: factReference(Task, "body"), label: "Details", representation: "paragraphs" },
    { fact: factReference(Task, "projects"), label: "Projects", representation: "tags" },
    { fact: factReference(Task, "status"), label: "Status", representation: "text" },
  ],
  actions: [
    { journey: EditTask, icon: "edit" },
    { journey: ReopenTask, icon: "retry", selection: { fact: factReference(Task, "status"), value: "open", label: "Open" } },
    { journey: CompleteTask, icon: "confirm", selection: { fact: factReference(Task, "status"), value: "completed", label: "Completed" } },
  ],
});
