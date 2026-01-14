import { NotificationType } from "../enums/notification";
import type { ApiResponse } from "./response";

export type Notification = {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationResponse = ApiResponse<Notification[]>;
