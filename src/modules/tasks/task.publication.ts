import { factReference, publishObject } from "desert-sdk/src/index.ts";
import { Task } from "./task.object.ts";
import { TaskDetailView } from "./views/taskDetail.view.ts";
import { EditTask } from "./journeys/editTask.journey.ts";
import { CompleteTask } from "./journeys/completeTask.journey.ts";
import { ReopenTask } from "./journeys/reopenTask.journey.ts";
import { m } from "../../messages/keys.ts";

export const PublishedTask = publishObject(Task, {
  view: TaskDetailView, title: factReference(Task, "title"),
  fields: [
    { fact: factReference(Task, "title"), label: m.tasks.titleField, representation: "text" },
    { fact: factReference(Task, "body"), label: m.tasks.detailsField, representation: "paragraphs" },
    { fact: factReference(Task, "projects"), label: m.tasks.projectsField, representation: "tags" },
    { fact: factReference(Task, "status"), label: m.tasks.statusField, representation: "text" },
  ],
  actions: [
    { journey: EditTask, icon: "edit" },
    { journey: ReopenTask, icon: "retry", selection: { fact: factReference(Task, "status"), value: "open", label: m.tasks.open } },
    { journey: CompleteTask, icon: "confirm", selection: { fact: factReference(Task, "status"), value: "completed", label: m.tasks.completed } },
  ],
});
