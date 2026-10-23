import { readJourney, viewOutput, type ViewJourney } from 'desert-sdk/src/index.ts';
import { Project } from '../project.object.ts';
import { TasksController } from '../tasks.dependencies.ts';
import { ProjectsView } from '../views/projects.view.ts';
import { ProjectDetailView } from '../views/projectDetail.view.ts';
export const ReadProjects=readJourney('read-projects',Project,{fields:['name','color'],collection:['name','color'],
  requires:{controller:TasksController,dependencies:[]}});
export const ReadProjectsExperience={id:ReadProjects.id,kind:'read',view:ProjectsView,detailView:ProjectDetailView,
  outputs:[{...viewOutput(ProjectsView,'select'),action:{kind:'select'}},
    {...viewOutput(ProjectDetailView,'close'),action:{kind:'close'}}]} satisfies ViewJourney;
