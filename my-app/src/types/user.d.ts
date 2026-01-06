import type { ApiResponse } from "./response";
import { UserRole } from "@_types/roles.enum";

export type UserResponse = ApiResponse<{
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}>;
