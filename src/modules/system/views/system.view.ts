import { Components, defineView } from "desert-sdk/src/index.ts";

export const SystemView = defineView({
  name: "system",
  content: [
    Components.Header({ title: "System", subtitle: "Current controller availability and installed contracts." }),
    Components.SystemStatus(),
  ],
});
