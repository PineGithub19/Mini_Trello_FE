import { ApiResponse, type PaginatedResponse } from "./response";

export type WorkspacePayload = {
  name: string;
  ownerId?: string;
};

export type WorkspaceResponse = ApiResponse<{
  id: string;
  name: string;
  background: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type WorkspacesListResponse = ApiResponse<
  PaginatedResponse<{
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  }>
>;
