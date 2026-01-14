import {
  useFetchAllNotifications,
  useMarkAllNotificationsAsRead,
} from "@/hooks/notification-hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "../ui/badge";

const Notifications = () => {
  const { data: notifications } = useFetchAllNotifications();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  const unreadCount = notifications?.data.filter((n) => !n.isRead).length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <Bell className="size-5" />
            <span className="sr-only">Open notifications</span>
          </Button>
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-80 flex flex-col gap-y-2"
      >
        <div className="flex items-center justify-between px-2 py-2">
          <h3 className="font-medium">Notifications</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => markAllAsRead()}
          >
            Mark all as read
          </Button>
        </div>
        {notifications?.data.length ? (
          notifications.data.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={
                notification.isRead
                  ? "bg-background"
                  : "bg-highlight text-highlight-text font-medium"
              }
            >
              <div>
                <p className="text-sm">
                  {notification.title} -{" "}
                  {formatDateTime(notification.createdAt)}
                </p>
                <p className="text-xs text-gray-500">{notification.content}</p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="bg-background">
            No notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
