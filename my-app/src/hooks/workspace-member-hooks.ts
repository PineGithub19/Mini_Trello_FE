import { queryClient } from "@/lib/utils";
import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type {
  WorkspaceMemberListResponse,
  WorkspaceMemberPayload,
  WorkspaceMemberRemovePayload,
  WorkspaceMemberResponse,
} from "@/types/workspace-member";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useAddWorkspaceMember = () => {
  return useMutation<
    WorkspaceMemberResponse,
    AxiosError<ErrorResponse>,
    WorkspaceMemberPayload
  >({
    mutationKey: ["add-workspace-member"],
    mutationFn: async (payload: WorkspaceMemberPayload) => {
      const response = await apiClient.post<WorkspaceMemberResponse>(
        ENDPOINTS.WORKSPACE_MEMBERS_ADD,
        payload
      );
      return response.data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", payload.workspaceId],
      });
    },
  });
};

export const useFetchMembersInWorkspace = (workspaceId: string) => {
  return useQuery<WorkspaceMemberListResponse, AxiosError<ErrorResponse>>({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      const response = await apiClient.get<WorkspaceMemberListResponse>(
        ENDPOINTS.WORKSPACE_MEMBERS_LIST,
        {
          params: { workspaceId },
        }
      );
      return response.data;
    },
    enabled: !!workspaceId,
  });
};

export const useRemoveWorkspaceMember = () => {
  return useMutation<
    WorkspaceMemberResponse,
    AxiosError<ErrorResponse>,
    WorkspaceMemberRemovePayload
  >({
    mutationKey: ["remove-workspace-member"],
    mutationFn: async (payload: WorkspaceMemberRemovePayload) => {
      const response = await apiClient.delete<WorkspaceMemberResponse>(
        `${ENDPOINTS.WORKSPACE_MEMBERS_REMOVE}/${payload.userId}`,
        { params: { workspaceId: payload.workspaceId } }
      );
      return response.data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", payload.workspaceId],
      });
    },
  });
};
