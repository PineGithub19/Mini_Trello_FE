import { useState } from "react";
import type { Task } from "@/types/task";
import { Checkbox } from "../ui/checkbox";
import { useFetchUserById } from "@/hooks/user-hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { TaskStatus } from "@/enums/tasks.enum";
import { useDeleteTask, useUpdateTask } from "@/hooks/task-hooks";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";
import TaskDetails from "./task-details";
import { MessageSquareText } from "lucide-react";
import { extractInitial } from "@/lib/utils";
import NotificationDialog from "../custom-ui/notification-dialog";

const TaskItem = ({ task }: { task: Task }) => {
  const { data: participant } = useFetchUserById(task.assignedToId);
  const { mutate: updateTask, isPending } = useUpdateTask(task.id);
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(task.id);

  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);

  const handleUpdateTaskStatus = (checked: CheckedState) => {
    const status: TaskStatus = checked === true ? "DONE" : "TODO";
    updateTask(
      {
        title: task.title,
        status,
        listId: task.listId,
      },
      {
        onError: (error) => {
          toastError(error);
        },
      }
    );
  };

  const handleDeleteTask = () => {
    setIsDeleteTaskDialogOpen(true);
  };

  const handleConfirmDeleteTask = () => {
    deleteTask(
      {
        listId: task.listId,
      },
      {
        onSuccess: () => {
          toastSuccess("Task deleted successfully");
          setIsDeleteTaskDialogOpen(false);
        },
        onError: (error) => {
          toastError(error);
        },
      }
    );
  };

  return (
    <>
      <NotificationDialog
        triggerElement={
          <li className="flex flex-col mb-2 p-2 bg-background rounded-md hover:cursor-pointer border border-transparent hover:border-primary">
            <div className="w-full flex items-start gap-2">
              <Checkbox
                className="mt-1.25"
                checked={task.status === "DONE"}
                disabled={isPending}
                onCheckedChange={handleUpdateTaskStatus}
              />
              <p className="whitespace-normal break-all leading-snug">
                {task.title}
              </p>
            </div>
            <div className="flex items-center justify-between ml-6">
              {task.description ? <MessageSquareText size={16} /> : <p></p>}
              {participant && (
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="size-6 ring-2 ring-background">
                      <AvatarImage src={participant.data.avatar || undefined} />
                      <AvatarFallback>
                        {extractInitial(participant.data.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent align="end" side="bottom">
                    <p>{participant.data.name}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </li>
        }
        cancelText="Close"
        actionText="Delete Task"
        className="min-w-6xl"
        onAction={handleDeleteTask}
      >
        <TaskDetails task={task} />
      </NotificationDialog>
      <AlertDialog
        open={isDeleteTaskDialogOpen}
        onOpenChange={setIsDeleteTaskDialogOpen}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task: {task.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and will remove the task and its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={handleConfirmDeleteTask}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskItem;
