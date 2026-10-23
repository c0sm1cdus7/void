import { Components, ViewTitles, defineView, viewPorts } from 'desert-sdk/src/index.ts';

const Ports=viewPorts({inputs:{draft:'form'},outputs:['close','save']});
export const ProjectEditorView=defineView({
  name:'project-editor',outputs:Ports.outputs,
  topDock:Components.Toolbar({actions:[{output:Ports.output.close,label:'Close',icon:'close'}]}),
  bottomDock:Components.Toolbar({actions:[{output:Ports.output.save,label:'Save project',icon:'save'}]}),
  content:[Components.Header({title:ViewTitles.operation,subtitle:'Name the project and choose its color.'}),
    Components.Form({input:Ports.inputs.draft})],
});
