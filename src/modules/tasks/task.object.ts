import { enumeration, references, objectType, ownershipPolicy, principal, text } from "desert-sdk/src/index.ts";
import { Project } from './project.object.ts';

export const Task = objectType({
  id: "task",
  facts: {
    title: text({ minLength: 1, maxLength: 200 }),
    body: text(),
    projects: references(Project,{label:'name',color:'color'}),
    status: enumeration(["open", "completed"]),
    owner: principal(),
  },
});

export const PrivateTasks = ownershipPolicy(Task, "owner");
