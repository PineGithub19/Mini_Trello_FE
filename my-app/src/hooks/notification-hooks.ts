import { queryClient } from "@/lib/utils";
import apiClient from "@/query/api-client";
import ENDPOINTS from "@/routes/endpoints";
import type { NotificationResponse } from "@/types/notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const useFetchAllNotifications = () => {
  return useQuery<NotificationResponse, AxiosError<ErrorResponse>>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await apiClient.get<NotificationResponse>(
        ENDPOINTS.NOTIFICATION
      );
      return response.data;
    },
  });
};

export const useMarkNotificationAsRead = (notificationId: string) => {
  return useMutation<
    NotificationResponse,
    AxiosError<ErrorResponse>,
    {
      notificationId: string;
    }
  >({
    mutationKey: ["markNotificationAsRead", notificationId],
    mutationFn: async ({ notificationId }) => {
      const response = await apiClient.patch<NotificationResponse>(
        ENDPOINTS.NOTIFICATION_MARK_AS_READ,
        { notificationId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation<NotificationResponse, AxiosError<ErrorResponse>>({
    mutationKey: ["markAllNotificationsAsRead"],
    mutationFn: async () => {
      const response = await apiClient.patch<NotificationResponse>(
        ENDPOINTS.NOTIFICATION_MARK_ALL_AS_READ
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
