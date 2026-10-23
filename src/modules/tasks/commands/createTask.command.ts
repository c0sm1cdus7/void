import { actorId, createCommand, fromInput, literal } from "desert-sdk/src/index.ts";
import { Task } from "../task.object.ts";

export const CreateTaskRecord = createCommand("create-task-record", Task, {
  input: ["title", "body", "projects"],
  values: { title: fromInput("title"), body: fromInput("body"), projects: fromInput("projects"),
    status: literal("open"), owner: actorId() },
});
