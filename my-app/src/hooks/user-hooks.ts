import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type { UserResponse } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

type UpdateUserPayload = {
  name: string;
  avatar?: string | null;
  password?: string;
};

export const useFetchUserProfile = () => {
  return useQuery<UserResponse>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await apiClient.get<UserResponse>(
        ENDPOINTS.USER_PROFILE
      );
      return response.data;
    },
  });
};

export const useFetchUserById = (userId: string) => {
  return useQuery<UserResponse>({
    queryKey: ["user-by-id", userId],
    queryFn: async () => {
      const response = await apiClient.get<UserResponse>(
        ENDPOINTS.USER_DETAIL.replace(":userId", userId)
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    AxiosError<ErrorResponse>,
    UpdateUserPayload
  >({
    mutationKey: ["update-user-profile"],
    mutationFn: async (payload) => {
      const response = await apiClient.patch<UserResponse>(
        ENDPOINTS.USER_PROFILE,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
