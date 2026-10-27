import { Components, ViewTitles, defineView, viewPorts } from 'desert-sdk/src/index.ts';
import { m } from "../../../messages/keys.ts";
const ports=viewPorts({inputs:{project:'context'},outputs:['close']});
export const ProjectDetailView=defineView({name:'project-detail',outputs:ports.outputs,
  topDock:Components.Toolbar({actions:[{output:ports.output.close,label:m.tasks.close,icon:'close'}]}),
  content:[Components.Header({title:ViewTitles.subject,subtitle:m.tasks.project.detailSubtitle}),Components.Context({input:ports.inputs.project})]});
