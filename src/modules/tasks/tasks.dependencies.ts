import { controllerRole } from "desert-sdk/src/index.ts";
import { Task } from "./task.object.ts";
import { Project } from "./project.object.ts";

export const TasksController = controllerRole({ id: "tasks", objects: [Task, Project], requires: [] });
