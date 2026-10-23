import { actorId, createCommand, fromInput, mutationJourney, viewOutput, type ViewJourney } from 'desert-sdk/src/index.ts';
import { Project } from '../project.object.ts';
import { TasksController } from '../tasks.dependencies.ts';
import { ProjectEditorView } from '../views/projectEditor.view.ts';
import { ReadProjects } from './readProjects.journey.ts';
export const CreateProject=mutationJourney('create-project',createCommand('create-project-record',Project,{
  input:['name','color'],values:{name:fromInput('name'),color:fromInput('color'),owner:actorId()}}),
  {controller:TasksController,dependencies:[]});

export const CreateProjectJourney={id:CreateProject.id,kind:'create',source:ReadProjects,view:ProjectEditorView,
  preferredDock:'right',outputs:[
    {...viewOutput(ProjectEditorView,'save'),action:{kind:'submit'}},
    {...viewOutput(ProjectEditorView,'close'),action:{kind:'close'}},
  ]} satisfies ViewJourney;
