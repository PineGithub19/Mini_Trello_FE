import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateTask, useFetchTasksInList } from "@/hooks/task-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";
import { Plus } from "lucide-react";

const taskCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type TaskCreateFormData = z.infer<typeof taskCreateSchema>;

const TaskCreate = ({ listId }: { listId: string }) => {
  const currentListId = listId;
  const { data: tasks } = useFetchTasksInList(currentListId || "");

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

  if (!isCreateMode) {
    return (
      <div
        tabIndex={-1}
        onFocus={() => setIsCreateMode(true)}
        onBlur={(e) => {
          // only close if focus left this entire container
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsCreateMode(false);
          }
        }}
      >
        <ul>
          {tasks?.data.map((task) => (
            <li
              key={task.id}
              className="mb-2 p-2 bg-background rounded-md hover:cursor-pointer border border-transparent hover:border-primary"
            >
              {task.title}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-2 rounded-md py-1 hover:bg-muted-foreground/10 hover:cursor-pointer">
          <Plus size="16" />
          New Task
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("title")} />
      {errors.title && (
        <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
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
  );
};

export default TaskCreate;
