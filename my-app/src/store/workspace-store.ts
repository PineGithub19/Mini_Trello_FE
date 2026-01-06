import { create } from "zustand";

interface WorkspaceState {
  currentWorkspaceId: string | null;
  currentWorkspaceName?: string;
  currentWorkspaceOwnerId?: string;
}

interface WorkspaceActions {
  setCurrentWorkspace: (workspaceId: string) => void;
  setCurrentWorkspaceName: (name: string) => void;
  setCurrentWorkspaceOwnerId: (ownerId: string) => void;
  clearCurrentWorkspace: () => void;
}

type WorkspaceStore = WorkspaceState & WorkspaceActions;

const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspaceId: null,
  currentWorkspaceName: undefined,
  currentWorkspaceOwnerId: undefined,

  setCurrentWorkspaceName: (name: string) => {
    set({ currentWorkspaceName: name });
  },

  setCurrentWorkspace: (workspaceId: string) => {
    set({ currentWorkspaceId: workspaceId });
  },

  setCurrentWorkspaceOwnerId: (ownerId: string) => {
    set({ currentWorkspaceOwnerId: ownerId });
  },

  clearCurrentWorkspace: () => {
    set({ currentWorkspaceId: null });
  },
}));

export default useWorkspaceStore;
