import { publishObject, factReference } from 'desert-sdk/src/index.ts';
import { Project } from './project.object.ts';
import { ProjectDetailView } from './views/projectDetail.view.ts';
export const PublishedProject=publishObject(Project,{view:ProjectDetailView,title:factReference(Project,'name'),actions:[],
  fields:[{fact:factReference(Project,'name'),label:'Name',representation:'text'},
    {fact:factReference(Project,'color'),label:'Color',representation:'text'}]});
