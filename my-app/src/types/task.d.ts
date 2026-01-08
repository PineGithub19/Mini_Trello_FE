import { TaskStatus, TaskPriority } from "@/enums/tasks.enum";
import type { ApiResponse } from "./response";

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
