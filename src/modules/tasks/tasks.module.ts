import { defineModule } from "desert-sdk/src/index.ts";
import { PrivateTasks } from "./task.object.ts";
import { PrivateProjects } from './project.object.ts';
import { PublishedProject } from './project.publication.ts';
import { ProjectDetailView } from './views/projectDetail.view.ts';
import { ProjectsView } from './views/projects.view.ts';
import { ReadProjects, ReadProjectsJourney } from './journeys/readProjects.journey.ts';
import { CreateProject, CreateProjectJourney } from './journeys/createProject.journey.ts';
import { ProjectEditorView } from './views/projectEditor.view.ts';
import { PublishedTask } from "./task.publication.ts";
import { TasksController } from "./tasks.dependencies.ts";
import { CreateTask, CreateTaskJourney } from "./journeys/createTask.journey.ts";
import { ReadTasks, ReadTasksJourney } from "./journeys/browseTasks.journey.ts";
import { EditTask, EditTaskJourney } from "./journeys/editTask.journey.ts";
import { CompleteTask, CompleteTaskJourney } from "./journeys/completeTask.journey.ts";
import { ReopenTask, ReopenTaskJourney } from "./journeys/reopenTask.journey.ts";
import { TasksView } from "./views/tasksHome.view.ts";
import { TaskEditorView } from "./views/taskEditor.view.ts";
import { TaskDetailView } from "./views/taskDetail.view.ts";
import { m } from "../../messages/keys.ts";

const TasksDestination = { id: "tasks", label: m.tasks.destination, icon: "confirm", entryJourney: ReadTasks } as const;

export const TasksModule = defineModule({
  id: "tasks", objects: [PublishedTask, PublishedProject], dependencies: [TasksController], policies: [PrivateTasks, PrivateProjects],
  journeys: [
    { execution:ReadProjects, presentation:ReadProjectsJourney, label:m.tasks.readProjects },
    { execution:CreateProject, presentation:CreateProjectJourney, label:m.tasks.createProject, humanReview:'not-required' },
    { execution: CreateTask, presentation: CreateTaskJourney, label: m.tasks.createTask, humanReview: "not-required" },
    { execution: ReadTasks, presentation: ReadTasksJourney, label: m.tasks.readTasks },
    { execution: EditTask, presentation: EditTaskJourney, label: m.tasks.editTask, humanReview: "not-required" },
    { execution: CompleteTask, presentation: CompleteTaskJourney, label: m.tasks.completeTask, humanReview: "not-required" },
    { execution: ReopenTask, presentation: ReopenTaskJourney, label: m.tasks.reopenTask, humanReview: "not-required" },
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
