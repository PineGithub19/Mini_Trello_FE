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
