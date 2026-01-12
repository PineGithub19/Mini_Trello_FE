import { useState } from "react";
import { Trash2 } from "lucide-react";
import TaskCreate from "./task-create";
import TaskListItemTitle from "./task-list-item-title";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import useProjectStore from "@/store/project-store";
import { useDeleteTaskList } from "@/hooks/list-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";

const TaskListItem = ({
  listTitle,
  listId,
  projectId,
}: {
  listTitle: string;
  listId: string;
  projectId: string;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const { mutate: deleteTaskList, isPending: isDeleting } = useDeleteTaskList();

  const handleDeleteTaskList = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteTaskList = () => {
    const targetProjectId = projectId || currentProjectId;

    if (!targetProjectId) {
      toastError("Missing project context for deletion");
      return;
    }

    deleteTaskList(
      { listId, projectId: targetProjectId },
      {
        onSuccess: () => {
          toastSuccess("Task list deleted successfully");
          setIsDeleteDialogOpen(false);
        },
        onError: (error) => {
          toastError(error || "Failed to delete task list");
        },
      }
    );
  };

  return (
    <>
      <div className="group relative w-64 bg-muted rounded-md px-4 py-2 pr-8">
        <TaskListItemTitle listTitle={listTitle} listId={listId} />
        <TaskCreate listId={listId} />
        <button
          type="button"
          onClick={handleDeleteTaskList}
          className="absolute top-2 right-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          aria-label="Delete task list"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete list: {listTitle}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes the list and all associated tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={handleConfirmDeleteTaskList}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskListItem;
