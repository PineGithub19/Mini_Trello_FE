import { queryClient } from "@/lib/utils";
import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type { TaskPayload, TaskResponse, TaskListResponse } from "@/types/task";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useCreateTask = () => {
  return useMutation<TaskResponse, AxiosError<ErrorResponse>, TaskPayload>({
    mutationKey: ["create-task"],
    mutationFn: async (taskPayload: TaskPayload) => {
      const response = await apiClient.post<TaskResponse>(
        ENDPOINTS.TASKS_CREATE,
        taskPayload
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks-in-list", variables.listId],
      });
    },
  });
};

export const useFetchTasksInList = (listId: string) => {
  return useQuery<TaskListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["tasks-in-list", listId],
    queryFn: async () => {
      const response = await apiClient.get<TaskListResponse>(
        ENDPOINTS.TASKS_LIST,
        { params: { listId } }
      );
      return response.data;
    },
    enabled: !!listId,
  });
};

export const useFetchTaskDetailsById = (taskId: string) => {
  return useQuery<TaskResponse, AxiosError<ErrorResponse>>({
    queryKey: ["task-details", taskId],
    queryFn: async () => {
      const response = await apiClient.get<TaskResponse>(
        ENDPOINTS.TASK_DETAIL.replace(":taskId", taskId)
      );
      return response.data;
    },
    enabled: !!taskId,
  });
};

export const useUpdateTask = (taskId: string) => {
  return useMutation<TaskResponse, AxiosError<ErrorResponse>, TaskPayload>({
    mutationKey: ["update-task", taskId],
    mutationFn: async (taskPayload: TaskPayload) => {
      const response = await apiClient.patch<TaskResponse>(
        ENDPOINTS.TASK_DETAIL.replace(":taskId", taskId),
        taskPayload
      );
      return response.data;
    },
  });
};
