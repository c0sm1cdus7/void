import { Components, defineView, viewPorts } from 'desert-sdk/src/index.ts';
const ports=viewPorts({inputs:{projects:'collection'},outputs:['select']});
export const ProjectsView=defineView({name:'projects',outputs:ports.outputs,
  content:[Components.Header({title:'Projects',subtitle:'Organize your tasks with named, colored projects.'}),Components.Collection({input:ports.inputs.projects,output:ports.output.select})]});
