import type { ApiResponse } from "./response";

export type AuthResponse = ApiResponse<{
  access_token: string;
  refresh_token: string;
}>;
