import { Components, defineView, viewPorts } from 'desert-sdk/src/index.ts';
import { m } from "../../../messages/keys.ts";
const ports=viewPorts({inputs:{projects:'collection'},outputs:['select']});
export const ProjectsView=defineView({name:'projects',outputs:ports.outputs,
  content:[Components.Header({title:m.tasks.projects.title,subtitle:m.tasks.projects.subtitle}),Components.Collection({input:ports.inputs.projects,output:ports.output.select})]});
