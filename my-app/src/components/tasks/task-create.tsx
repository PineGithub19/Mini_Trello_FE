import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateTask, useFetchTasksInList } from "@/hooks/task-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";
import { Plus } from "lucide-react";
import TaskItem from "./task-item";
import { useTaskStore } from "@/store/task-store";

const taskCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type TaskCreateFormData = z.infer<typeof taskCreateSchema>;

const TaskCreate = ({ listId }: { listId: string }) => {
  const currentListId = listId;
  const { data: tasks } = useFetchTasksInList(currentListId || "");

  const setTaskId = useTaskStore((state) => state.setTaskId);

  const [isCreateMode, setIsCreateMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreateFormData>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createTask } = useCreateTask();

  const onSubmit = (data: TaskCreateFormData) => {
    if (!currentListId) return;

    const payload = {
      title: data.title,
      listId: currentListId,
    };
    createTask(payload, {
      onSuccess: () => {
        toastSuccess("Task created successfully");
        setIsCreateMode(false);
      },
      onError: (error) => {
        toastError(error || "Failed to create task");
      },
    });
  };

  const handleTaskItemClick = (taskId: string) => {
    setTaskId(taskId);
  };

  return (
    <div>
      <ul>
        {tasks?.data.map((task) => (
          <div onClick={() => handleTaskItemClick(task.id)} key={task.id}>
            <TaskItem task={task} />
          </div>
        ))}
      </ul>
      {!isCreateMode && (
        <div
          className="flex items-center justify-center gap-2 rounded-md py-1 hover:bg-muted-foreground/10 hover:cursor-pointer"
          onClick={() => setIsCreateMode(true)}
        >
          <Plus size="16" />
          New Task
        </div>
      )}
      {isCreateMode && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("title")} />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">
              {errors.title.message}
            </p>
          )}
          <div className="mt-2">
            <Button size="sm" type="submit">
              Create Task
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="ml-2 bg-muted hover:bg-foreground/10"
              onClick={() => setIsCreateMode(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskCreate;
