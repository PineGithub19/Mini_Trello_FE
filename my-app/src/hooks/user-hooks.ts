import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type { UserResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

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
