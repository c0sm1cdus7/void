import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

const Ports = viewPorts({ inputs: { title: "form" }, outputs: [] });

export const NoteTitleView = defineView({
  name: "note-title",
  content: [
    Components.Header({ title: m.notes.titleStep.title, subtitle: m.notes.titleStep.subtitle }),
    Components.Form({ input: Ports.inputs.title }),
  ],
});
