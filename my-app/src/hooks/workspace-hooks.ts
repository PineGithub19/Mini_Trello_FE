import { queryClient } from "@/lib/utils";
import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type {
  WorkspaceResponse,
  WorkspacesListResponse,
} from "@/types/workspace";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useCreateWorkspaces = () => {
  return useMutation<
    WorkspaceResponse,
    AxiosError<ErrorResponse>,
    { name: string; ownerId?: string }
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<WorkspaceResponse>(
        ENDPOINTS.WORKSPACES_CREATE,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"], exact: false });
    },
  });
};

export const useFetchWorkspaces = (page: number = 1, limit: number = 10) => {
  return useQuery<WorkspacesListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["workspaces", page],
    queryFn: async () => {
      const response = await apiClient.get<WorkspacesListResponse>(
        ENDPOINTS.WORKSPACES_LIST,
        {
          params: {
            page,
            limit,
          },
        }
      );
      return response.data;
    },
  });
};

export const useFetchColaboratedWorkspaces = (
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<WorkspacesListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["colaborated-workspaces", page],
    queryFn: async () => {
      const response = await apiClient.get<WorkspacesListResponse>(
        ENDPOINTS.COLABORATED_WORKSPACE_LIST,
        {
          params: {
            page,
            limit,
          },
        }
      );
      return response.data;
    },
  });
};
