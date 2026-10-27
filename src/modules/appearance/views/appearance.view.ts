import { Components, defineView } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

export const AppearanceView = defineView({
  name: "appearance",
  content: [
    Components.Header({ title: m.appearance.title, subtitle: m.appearance.subtitle }),
    Components.Appearance(),
  ],
});
