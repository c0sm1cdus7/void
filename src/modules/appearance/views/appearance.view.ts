import { Components, defineView } from "desert-sdk/src/index.ts";

export const AppearanceView = defineView({
  name: "appearance",
  content: [
    Components.Header({ title: "Appearance", subtitle: "Make VOID comfortable on this device." }),
    Components.Appearance(),
  ],
});
