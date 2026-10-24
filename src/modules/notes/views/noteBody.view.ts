import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { body: "form" }, outputs: [] });

export const NoteBodyView = defineView({
  name: "note-body",
  content: [
    Components.Header({ title: m.notes.body.title, subtitle: m.notes.body.subtitle }),
    Components.Form({ input: Ports.inputs.body }),
  ],
});
