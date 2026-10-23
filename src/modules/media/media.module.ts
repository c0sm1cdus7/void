import { defineModule } from "desert-sdk/src/index.ts";
import { PrivateImages } from "./image.object.ts";
import { PublishedImage } from "./image.publication.ts";
import { MediaController } from "./media.dependencies.ts";
import { ReadImages } from "./journeys/readImages.journey.ts";
import { ReadImagesJourney } from "./journeys/browseImages.journey.ts";
import { ImportImage, ImportImageJourney } from "./journeys/importImage.journey.ts";
import { ImagesView } from "./views/images.view.ts";
import { ImageDetailView } from "./views/imageDetail.view.ts";
import { ImportImageView } from "./views/importImage.view.ts";
import { ImageTrashView } from "./views/imageTrash.view.ts";
import { TrashImage, TrashImageJourney } from "./journeys/trashImage.journey.ts";
import { RestoreImage, RestoreImageJourney } from "./journeys/restoreImage.journey.ts";
import { ReadImageTrash } from "./journeys/readImageTrash.journey.ts";
import { ReadImageTrashJourney } from "./journeys/browseImageTrash.journey.ts";
import { EditImage, EditImageJourney } from "./journeys/editImage.journey.ts";
import { EditImageView } from "./views/editImage.view.ts";
import { PrivateCollections } from "./collection.object.ts";
import { PublishedCollection } from "./collection.publication.ts";
import { MediaOverviewView } from "./views/mediaOverview.view.ts";
import { CollectionsView } from "./views/collections.view.ts";
import { CollectionDetailView } from "./views/collectionDetail.view.ts";
import { CollectionEditorView } from "./views/collectionEditor.view.ts";
import { BrowseMediaOverview } from "./journeys/browseMediaOverview.journey.ts";
import { ReadCollections } from "./journeys/readCollections.journey.ts";
import { ReadCollectionsJourney } from "./journeys/browseCollections.journey.ts";
import { CreateCollection } from "./journeys/createCollection.journey.ts";
import { EditCollection, EditCollectionJourney } from "./journeys/editCollection.journey.ts";
import { SetMediaCollections } from "./journeys/setMediaCollections.journey.ts";

const MediaDestination = {
  id: "media", label: "Media", icon: "media", entryJourney: BrowseMediaOverview,
} as const;
const ImageTrashDestination = { id: "image-trash", label: "Media Trash", icon: "archive", entryJourney: ReadImageTrash } as const;
const CollectionDestination = { id: "media-collection", label: "Collection", icon: "media", entryJourney: ReadCollections } as const;

export const MediaModule = defineModule({
  id: "media", objects: [PublishedImage, PublishedCollection], dependencies: [MediaController], policies: [PrivateImages, PrivateCollections],
  views: [ImagesView, ImageDetailView, ImportImageView, ImageTrashView, EditImageView,
    MediaOverviewView, CollectionsView, CollectionDetailView, CollectionEditorView],
  journeys: [
    { presentation: BrowseMediaOverview },
    { execution: ReadCollections, presentation: ReadCollectionsJourney, label: "Collections" },
    { execution: CreateCollection, label: "Create collection", humanReview: "not-required" },
    { execution: EditCollection, presentation: EditCollectionJourney, label: "Edit collection", humanReview: "not-required" },
    { execution: SetMediaCollections, label: "Update collection membership", humanReview: "not-required" },
    { execution: ReadImages, presentation: ReadImagesJourney, label: "Media" },
    { execution: ImportImage, presentation: ImportImageJourney, label: "Add media", humanReview: "not-required" },
    { execution: EditImage, presentation: EditImageJourney, label: "Edit media", humanReview: "not-required" },
    { execution: TrashImage, presentation: TrashImageJourney, label: "Move to Trash", humanReview: "confirmation" },
    { execution: RestoreImage, presentation: RestoreImageJourney, label: "Restore media", humanReview: "not-required" },
    { execution: ReadImageTrash, presentation: ReadImageTrashJourney, label: "Media Trash" },
  ],
  destinations: [MediaDestination, ImageTrashDestination, CollectionDestination],
  exports: {
    destinations: { Media: MediaDestination }, views: { Media: MediaOverviewView, ImageDetail: ImageDetailView },
    journeys: { importImage: ImportImage, readImages: ReadImages, editImage: EditImage,
      trashImage: TrashImage, restoreImage: RestoreImage, readImageTrash: ReadImageTrash,
      readCollections: ReadCollections, createCollection: CreateCollection, editCollection: EditCollection, setMediaCollections: SetMediaCollections },
    dependencies: { media: MediaController },
  },
});
