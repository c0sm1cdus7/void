import { mutationJourney, viewOutput, type ViewJourney } from "desert-sdk/src/index.ts";
import { CreateCollectionRecord } from "../commands/createCollection.command.ts";
import { MediaController } from "../media.dependencies.ts";
import { CollectionCreateView } from "../views/collectionCreate.view.ts";
import { ReadCollections } from "./readCollections.journey.ts";
export const CreateCollection = mutationJourney("create-media-collection", CreateCollectionRecord, { controller: MediaController, dependencies: [] });
export const CreateCollectionJourney = { id: CreateCollection.id, kind: "create", source: ReadCollections,
  view: CollectionCreateView, preferredDock: "right", presentation: "transient", outputs: [
    { ...viewOutput(CollectionCreateView, "save"), action: { kind: "submit" } },
    { ...viewOutput(CollectionCreateView, "close"), action: { kind: "close" } },
  ],
} satisfies ViewJourney;
