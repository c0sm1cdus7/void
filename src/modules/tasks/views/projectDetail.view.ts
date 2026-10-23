import { Components, ViewTitles, defineView, viewPorts } from 'desert-sdk/src/index.ts';
const ports=viewPorts({inputs:{project:'context'},outputs:['close']});
export const ProjectDetailView=defineView({name:'project-detail',outputs:ports.outputs,
  topDock:Components.Toolbar({actions:[{output:ports.output.close,label:'Close',icon:'close'}]}),
  content:[Components.Header({title:ViewTitles.subject,subtitle:'Use this project to group your personal tasks.'}),Components.Context({input:ports.inputs.project})]});
