import { Components, defineView, viewPorts } from "desert-sdk/src/index.ts";

const Ports = viewPorts({ inputs: { preparedNote: "context" }, outputs: [] });

export const NoteReviewView = defineView({
  name: "note-review",
  content: [Components.Context({ input: Ports.inputs.preparedNote })],
});
