import { create } from "zustand";

interface ProjectState {
  currentWorkspaceId: string | null;
  currentProjectId: string | null;
  currentProjectName?: string;
}

interface ProjectActions {
  setCurrentWorkspace: (workspaceId: string) => void;
  setCurrentProject: (projectId: string) => void;
  setCurrentProjectName: (name: string) => void;
  clearCurrentProject: () => void;
}

type ProjectStore = ProjectState & ProjectActions;

const useProjectStore = create<ProjectStore>((set) => ({
  currentWorkspaceId: null,
  currentProjectId: null,
  currentProjectName: undefined,

  setCurrentWorkspace: (workspaceId: string) => {
    set({ currentWorkspaceId: workspaceId });
  },

  setCurrentProject: (projectId: string) => {
    set({ currentProjectId: projectId });
  },

  setCurrentProjectName: (name: string) => {
    set({ currentProjectName: name });
  },

  clearCurrentProject: () => {
    set({
      currentProjectId: null,
      currentProjectName: undefined,
    });
  },
}));

export default useProjectStore;
