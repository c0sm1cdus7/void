import { viewCatalog } from "desert-sdk/src/index.ts";
import { NotesView } from "./notes.view.ts";
import { HomeView } from "./home.view.ts";
import { NoteEditorView } from "./noteEditor.view.ts";
import { NoteDetailView } from "./noteDetail.view.ts";
import { VisualCatalogView } from "./visualCatalog.view.ts";

/** Validation is not mounting, journey binding or permission to execute. */
export const VoidViews = viewCatalog([HomeView, NotesView, NoteEditorView, NoteDetailView, VisualCatalogView]);
