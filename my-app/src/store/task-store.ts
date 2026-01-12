import { create } from "zustand";

interface TaskState {
  taskId: string | null;
}

interface TaskStore {
  task: TaskState;
  setTaskId: (taskId: string | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  task: {
    taskId: null,
  },
  setTaskId: (taskId: string | null) =>
    set((state) => ({
      task: {
        ...state.task,
        taskId,
      },
    })),
}));
