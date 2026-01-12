import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type { SearchWorkspaceResponse } from "@/types/search";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useSearchWorkspaces = (keyword: string) => {
  const trimmedKeyword = keyword.trim();

  return useQuery<SearchWorkspaceResponse, AxiosError<ErrorResponse>>({
    queryKey: ["search", "workspaces", trimmedKeyword],
    queryFn: async () => {
      const response = await apiClient.get<SearchWorkspaceResponse>(
        ENDPOINTS.SEARCH,
        {
          params: {
            text: trimmedKeyword,
          },
        }
      );
      return response.data;
    },
    enabled: trimmedKeyword.length > 0,
    staleTime: 60 * 1000,
  });
};
