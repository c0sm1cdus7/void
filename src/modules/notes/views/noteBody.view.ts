import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { body: "form" }, outputs: [] });

export const NoteBodyView = defineView({
  name: "note-body",
  content: [
    Components.Header({ title: "Write your note", subtitle: "Review the note before saving it." }),
    Components.Form({ input: Ports.inputs.body }),
  ],
});
