import { literal, updateCommand } from "desert-sdk/src/index.ts";
import { Task } from "../task.object.ts";

export const CompleteTaskRecord = updateCommand("complete-task-record", Task, {
  input: [], when: { status: "open" }, set: { status: literal("completed") },
});
