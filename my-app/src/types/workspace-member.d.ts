import type { ApiResponse } from "./response";
import type { UserResponse } from "./user";

export type WorkspaceMemberPayload = {
  email: string;
  role: string;
  workspaceId: string;
};

export type WorkspaceMemberRemovePayload = {
  userId: string;
  workspaceId: string;
};

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMemberResponse = ApiResponse<WorkspaceMember>;
export type WorkspaceMemberListResponse = ApiResponse<
  (WorkspaceMember & {
    userInformation: UserResponse["data"];
  })[]
>;
