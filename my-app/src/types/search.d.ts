import type { ApiResponse } from "./response";

export type SearchWorkspaceResponse = ApiResponse<
  {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
  }[]
>;
