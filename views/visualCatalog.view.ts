import { ViewVersion, type View } from "desert-sdk/src/index.ts";

export const VisualCatalogView = {
  version: ViewVersion, id: "visual-catalog",
  content: [
    { kind: "header", id: "catalog-header", title: "Visual catalog",
      subtitle: "Shared web components. Examples stay here; they never change your notes." },
    { kind: "visual-catalog", id: "web-catalog" },
  ],
} satisfies View;
