import { fromInput, updateCommand } from "desert-sdk/src/index.ts";
import { Task } from "../task.object.ts";

export const EditTaskRecord = updateCommand("edit-task-record", Task, {
  input: ["title", "body", "projects"], when: {},
  set: { title: fromInput("title"), body: fromInput("body"), projects: fromInput("projects") },
});
