import type { ApiResponse } from "./response";

export type UserResponse = ApiResponse<{
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}>;
