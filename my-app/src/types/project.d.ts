import type { ApiResponse, PaginatedResponse } from "./response";

export type Project = {
  id: string;
  name: string;
  background: string;
  description: string;
  workspaceId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectCreatePayload = {
  name: string;
  background: string;
  description: string;
  workspaceId: string;
  createdBy?: string;
};

export type ProjectResponse = ApiResponse<Project>;

export type ProjectsListResponse = ApiResponse<PaginatedResponse<Project>>;
