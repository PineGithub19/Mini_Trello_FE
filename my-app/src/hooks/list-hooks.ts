import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type {
  TaskListPayload,
  TaskListResponse,
  TaskListsResponse,
} from "@/types/list";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";
import { queryClient } from "@/lib/utils";

export const useCreateTaskList = () => {
  return useMutation<
    TaskListResponse,
    AxiosError<ErrorResponse>,
    TaskListPayload
  >({
    mutationKey: ["create-task-list"],
    mutationFn: async (taskListPayload: TaskListPayload) => {
      const response = await apiClient.post<TaskListResponse>(
        ENDPOINTS.LISTS_CREATE,
        taskListPayload
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task-lists-in-project", variables.projectId],
      });
    },
  });
};

export const useFetchTaskListsInProject = (projectId: string) => {
  return useQuery<TaskListsResponse, AxiosError<ErrorResponse>>({
    queryKey: ["task-lists-in-project", projectId],
    queryFn: async () => {
      const response = await apiClient.get<TaskListsResponse>(ENDPOINTS.LISTS, {
        params: { projectId },
      });
      return response.data;
    },
    enabled: !!projectId,
  });
};
