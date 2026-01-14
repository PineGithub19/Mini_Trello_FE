export const NotificationType = {
  TASK_ASSIGNED: "TASK_ASSIGNED",
  TASK_UPDATED: "TASK_UPDATED",
  TASK_DELETED: "TASK_DELETED",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
