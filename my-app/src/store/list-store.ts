import { create } from "zustand";

interface ListState {
  currentListId: string | null;
  currentListName?: string;
}

interface ListActions {
  setCurrentList: (listId: string) => void;
  setCurrentListName: (name: string) => void;
  clearCurrentList: () => void;
}

type ListStore = ListState & ListActions;

const useListStore = create<ListStore>((set) => ({
  currentListId: null,
  currentListName: undefined,

  setCurrentList: (listId: string) => {
    set({ currentListId: listId });
  },

  setCurrentListName: (name: string) => {
    set({ currentListName: name });
  },

  clearCurrentList: () => {
    set({
      currentListId: null,
      currentListName: undefined,
    });
  },
}));

export default useListStore;
