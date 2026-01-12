import { ApiResponse } from "./response";

export type BackgroundListResponse = ApiResponse<
  {
    name: string;
    url: string;
  }[]
>;

export type UploadedImageResponse = ApiResponse<{
  url: string;
  path: string;
}>;
