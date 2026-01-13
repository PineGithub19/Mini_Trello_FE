import { queryClient } from "@/lib/utils";
import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type {
  ProjectCreatePayload,
  ProjectResponse,
  ProjectsListResponse,
} from "@/types/project";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useCreateProject = () => {
  return useMutation<
    ProjectResponse,
    AxiosError<ErrorResponse>,
    ProjectCreatePayload
  >({
    mutationKey: ["create-project"],
    mutationFn: async (payload) => {
      const response = await apiClient.post<ProjectResponse>(
        ENDPOINTS.PROJECTS_CREATE,
        payload
      );
      return response.data;
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", _data.data.workspaceId],
        exact: false,
      });
    },
  });
};

export const useFetchProjectsInCurrentWorkspace = (
  workspaceId: string,
  page: number = 1,
  limit: number = 8
) => {
  return useQuery<ProjectsListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["projects", workspaceId, page],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsListResponse>(
        ENDPOINTS.PROJECTS_LIST,
        {
          params: {
            workspaceId,
            page,
            limit,
          },
        }
      );
      return response.data;
    },
    enabled: !!workspaceId,
  });
};

export const useFetchProjectById = (projectId: string) => {
  return useQuery<ProjectResponse, AxiosError<ErrorResponse>>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await apiClient.get<ProjectResponse>(
        ENDPOINTS.PROJECT_DETAIL.replace(":projectId", projectId)
      );
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useUpdateProjectById = (projectId: string) => {
  return useMutation<
    ProjectResponse,
    AxiosError<ErrorResponse>,
    Partial<ProjectCreatePayload>
  >({
    mutationKey: ["update-project", projectId],
    mutationFn: async (payload) => {
      const response = await apiClient.patch<ProjectResponse>(
        ENDPOINTS.PROJECTS_UPDATE.replace(":projectId", projectId),
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["project", data.data.id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", data.data.workspaceId],
        exact: false,
      });
    },
  });
};
