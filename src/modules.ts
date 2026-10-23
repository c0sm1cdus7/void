import { moduleCatalog } from "desert-sdk/src/index.ts";
import { NotesModule } from "./modules/notes/notes.module.ts";
import { MediaModule } from "./modules/media/media.module.ts";
import { VisualCatalogModule } from "./modules/visualCatalog/visualCatalog.module.ts";
import { AppearanceModule } from "./modules/appearance/appearance.module.ts";
import { TasksModule } from "./modules/tasks/tasks.module.ts";
import { SystemModule } from "./modules/system/system.module.ts";
import { IdentityModule } from "./modules/identity/identity.module.ts";

export const Modules = moduleCatalog([NotesModule, TasksModule, MediaModule, SystemModule, AppearanceModule, IdentityModule, VisualCatalogModule]);
export const Journeys = Modules.journeys;
export const Views = Modules.views;
export const Commands = Modules.commands;
export const Destinations = Modules.destinations;
export const Dependencies = Modules.dependencies;
export const Objects = Modules.objects;
