import { Components, defineView } from "desert-sdk/src/index.ts";

export const VisualCatalogView = defineView({
  name: "visual-catalog",
  content: [
    Components.Header({ title: "Visual catalog", subtitle: "Foundations and compositions used throughout VOID. Examples never change your content." }),
    Components.VisualCatalog(),
  ],
});
