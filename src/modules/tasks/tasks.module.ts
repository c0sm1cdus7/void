import { defineModule } from "desert-sdk/src/index.ts";
import { PrivateTasks } from "./task.object.ts";
import { PrivateProjects } from './project.object.ts';
import { PublishedProject } from './project.publication.ts';
import { ProjectDetailView } from './views/projectDetail.view.ts';
import { ProjectsView } from './views/projects.view.ts';
import { ReadProjects, ReadProjectsExperience } from './journeys/readProjects.journey.ts';
import { CreateProject, CreateProjectExperience } from './journeys/createProject.journey.ts';
import { ProjectEditorView } from './views/projectEditor.view.ts';
import { PublishedTask } from "./task.publication.ts";
import { TasksController } from "./tasks.dependencies.ts";
import { CreateTask, CreateTaskExperience } from "./journeys/createTask.journey.ts";
import { ReadTasks, ReadTasksExperience } from "./journeys/browseTasks.journey.ts";
import { EditTask, EditTaskExperience } from "./journeys/editTask.journey.ts";
import { CompleteTask, CompleteTaskExperience } from "./journeys/completeTask.journey.ts";
import { ReopenTask, ReopenTaskExperience } from "./journeys/reopenTask.journey.ts";
import { TasksView } from "./views/tasksHome.view.ts";
import { TaskEditorView } from "./views/taskEditor.view.ts";
import { TaskDetailView } from "./views/taskDetail.view.ts";

const TasksDestination = { id: "tasks", label: "Tasks", icon: "confirm", entryJourney: ReadTasks } as const;

export const TasksModule = defineModule({
  id: "tasks", objects: [PublishedTask, PublishedProject], dependencies: [TasksController], policies: [PrivateTasks, PrivateProjects],
  journeys: [
    { execution:ReadProjects, presentation:ReadProjectsExperience, label:'Projects' },
    { execution:CreateProject, presentation:CreateProjectExperience, label:'Create project', humanReview:'not-required' },
    { execution: CreateTask, presentation: CreateTaskExperience, label: "Create task", humanReview: "not-required" },
    { execution: ReadTasks, presentation: ReadTasksExperience, label: "Tasks" },
    { execution: EditTask, presentation: EditTaskExperience, label: "Edit task", humanReview: "not-required" },
    { execution: CompleteTask, presentation: CompleteTaskExperience, label: "Complete task", humanReview: "not-required" },
    { execution: ReopenTask, presentation: ReopenTaskExperience, label: "Reopen task", humanReview: "not-required" },
  ],
  views: [TasksView, TaskEditorView, TaskDetailView, ProjectDetailView, ProjectsView, ProjectEditorView], destinations: [TasksDestination],
  exports: {
    objects: { Task: PublishedTask },
    journeys: { createProject:CreateProject, readProjects:ReadProjects, createTask: CreateTask, readTasks: ReadTasks, editTask: EditTask,
      completeTask: CompleteTask, reopenTask: ReopenTask },
    views: { Tasks: TasksView, TaskEditor: TaskEditorView, TaskDetail: TaskDetailView },
    destinations: { Tasks: TasksDestination }, dependencies: { tasks: TasksController },
  },
});
