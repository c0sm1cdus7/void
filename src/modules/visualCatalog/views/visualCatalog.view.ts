import { Components, defineView } from "desert-sdk/src/index.ts";
import { m } from "../../../messages/keys.ts";

export const VisualCatalogView = defineView({
  name: "visual-catalog",
  content: [
    Components.Header({ title: m.visualCatalog.title, subtitle: m.visualCatalog.subtitle }),
    Components.VisualCatalog(),
  ],
});
