import { ViewVersion, type View } from "desert-sdk/src/index.ts";

export const HomeView = {
  version: ViewVersion, id: "home", outputs: ["create"],
  topDock: { kind: "toolbar", actions: [
    { output: "create", label: "Create note", icon: "create" },
  ] },
  content: [
    { kind: "header", id: "home-header", title: "Home", subtitle: "A place for your ideas." },
    { kind: "stack", id: "welcome", title: "Welcome to VOID", items: [
      { kind: "text", text: "Capture a thought in Notes. Explore the pieces that shape this experience in Visual catalog." },
    ] },
    { kind: "stack", id: "local", title: "Your local workspace", items: [
      { kind: "text", text: "Notes are saved on this computer. This development workspace is private to your local identity." },
    ] },
  ],
} satisfies View;
