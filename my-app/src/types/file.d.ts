import { ApiResponse } from "./response";

export type BackgroundListResponse = ApiResponse<
  {
    name: string;
    url: string;
  }[]
>;
