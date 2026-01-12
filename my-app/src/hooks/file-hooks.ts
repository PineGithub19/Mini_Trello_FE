import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type {
  BackgroundListResponse,
  UploadedImageResponse,
} from "@/types/file";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useUploadImage = () => {
  return useMutation<
    UploadedImageResponse,
    AxiosError<ErrorResponse>,
    FormData
  >({
    mutationKey: ["upload-image"],
    mutationFn: async (formData) => {
      const response = await apiClient.post<UploadedImageResponse>(
        ENDPOINTS.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });
};

export const useFetchDefaultBackgroundList = () => {
  return useQuery<BackgroundListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["default-background-list"],
    queryFn: async () => {
      const response = await apiClient.get<BackgroundListResponse>(
        ENDPOINTS.DEFAULT_IMAGES
      );
      return response.data;
    },
  });
};
