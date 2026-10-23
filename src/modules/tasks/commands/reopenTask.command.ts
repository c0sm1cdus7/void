import { literal, updateCommand } from "desert-sdk/src/index.ts";
import { Task } from "../task.object.ts";

export const ReopenTaskRecord = updateCommand("reopen-task-record", Task, {
  input: [], when: { status: "completed" }, set: { status: literal("open") },
});
