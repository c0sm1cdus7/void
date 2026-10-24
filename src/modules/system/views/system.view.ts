import { Components, defineView } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

export const SystemView = defineView({
  name: "system",
  content: [
    Components.Header({ title: m.system.title, subtitle: m.system.subtitle }),
    Components.SystemStatus(),
  ],
});
