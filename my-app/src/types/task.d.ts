import { TaskStatus, TaskPriority } from "@/enums/tasks.enum";
import type { ApiResponse } from "./response";
import type { UserResponse } from "./user";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  listId: string;
  createdById: string;
  assignedToId: string;
};

export type TaskPayload = {
  title: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  listId: string;
  createdById?: string;
  assignedToId?: string;
};

export type TaskResponse = ApiResponse<Task>;
export type TaskListResponse = ApiResponse<Task[]>;

export type TaskCommentPayload = {
  content: string;
  taskId: string;
};

export type TaskComment = {
  id: string;
  content: string;
  taskId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskCommentResponse = ApiResponse<
  (TaskComment & {
    userInformation: UserResponse["data"];
  })[]
>;
