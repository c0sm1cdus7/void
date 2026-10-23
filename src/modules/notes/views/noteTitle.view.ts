import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { title: "form" }, outputs: [] });

export const NoteTitleView = defineView({
  name: "note-title",
  content: [
    Components.Header({ title: "Name your note", subtitle: "You can leave the title empty." }),
    Components.Form({ input: Ports.inputs.title }),
  ],
});
