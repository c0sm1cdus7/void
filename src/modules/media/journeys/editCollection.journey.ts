import { factReference, initializeInput, mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { EditCollectionRecord } from "../commands/editCollection.command.ts";
import { MediaCollection } from "../collection.object.ts";
import { MediaController } from "../media.dependencies.ts";
import { CollectionEditorView } from "../views/collectionEditor.view.ts";
import { ReadCollections } from "./readCollections.journey.ts";
export const EditCollection = mutationJourney("edit-media-collection", EditCollectionRecord, { controller: MediaController, dependencies: [] });
export const EditCollectionExperience = { id: EditCollection.id, kind: "update", source: ReadCollections,
  view: CollectionEditorView, preferredDock: "right", presentation: "transient",
  initialize: [initializeInput(EditCollectionRecord, "title", factReference(MediaCollection, "title")),
    initializeInput(EditCollectionRecord, "layout", factReference(MediaCollection, "layout")),
    initializeInput(EditCollectionRecord, "cover", factReference(MediaCollection, "cover"))], outputs: [
    { ...viewOutput(CollectionEditorView, "save"), action: { kind: "submit" } },
    { ...viewOutput(CollectionEditorView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
