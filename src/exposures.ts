import { agentExposure, humanExposure } from "desert-sdk/src/index.ts";
import { Journeys } from "./modules.ts";

const ExposedJourneys = [Journeys.createNote, Journeys.readNotes, Journeys.editNote,
  Journeys.readTrash, Journeys.trashNote, Journeys.restoreNote, Journeys.guidedNote,
  Journeys.createTask, Journeys.readTasks, Journeys.editTask, Journeys.completeTask, Journeys.reopenTask, Journeys.createProject, Journeys.readProjects,
  Journeys.readImages, Journeys.readImageTrash, Journeys.editImage, Journeys.trashImage, Journeys.restoreImage,
  Journeys.readCollections, Journeys.createCollection, Journeys.editCollection, Journeys.setMediaCollections];

export const VoidHumanExposure = humanExposure({
  id: "human",
  journeys: [...ExposedJourneys, Journeys.importImage],
  locale: "en",
});

export const VoidAgentExposure = agentExposure("agent", ExposedJourneys);
