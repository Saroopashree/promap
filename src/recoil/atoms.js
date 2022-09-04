import { atom } from "recoil";
import { getActiveProject, getSessionToken } from "../services/lsService";

export const allUsersState = atom({ key: "allUsers", default: [] });

export const sessionTokenState = atom({
  key: "sessionToken",
  default: null,
});

export const allProjectsState = atom({ key: "allProjects", default: [] });

export const activeProjectIdState = atom({
  key: "activeProjectId",
  default: null,
});

export const allPlansState = atom({ key: "allPlans", default: [] });

export const tasksInKanbanState = atom({ key: "tasksInKanban", default: [] });
