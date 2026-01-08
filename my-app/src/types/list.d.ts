import type { ApiResponse } from "./response";

export type TaskList = {
  id: string;
  title: string;
  position: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskListPayload = {
  title: string;
  projectId: string;
};

export type TaskListResponse = ApiResponse<TaskList>;
export type TaskListsResponse = ApiResponse<TaskList[]>;
