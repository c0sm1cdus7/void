import { publishObject, factReference } from 'desert-sdk/src/index.ts';
import { Project } from './project.object.ts';
import { ProjectDetailView } from './views/projectDetail.view.ts';
import { m } from "../../messages/keys.ts";
export const PublishedProject=publishObject(Project,{view:ProjectDetailView,title:factReference(Project,'name'),actions:[],
  fields:[{fact:factReference(Project,'name'),label:m.tasks.project.nameField,representation:'text'},
    {fact:factReference(Project,'color'),label:m.tasks.project.colorField,representation:'text'}]});
