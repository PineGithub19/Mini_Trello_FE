import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useProjectStore from "@/store/project-store";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";
import { useCreateTaskList } from "@/hooks/list-hooks";
import { Plus } from "lucide-react";

const taskCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type TaskCreateFormData = z.infer<typeof taskCreateSchema>;

const TaskListCreate = () => {
  const currentProjectId = useProjectStore((state) => state.currentProjectId);

  const [isCreatingNewList, setIsCreatingNewList] = useState(false);

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

  const { mutate: createTaskList } = useCreateTaskList();

  const onSubmit = (data: TaskCreateFormData) => {
    if (!currentProjectId) return;

    const payload = {
      title: data.title,
      projectId: currentProjectId,
    };
    createTaskList(payload, {
      onSuccess: () => {
        toastSuccess("Task created successfully");
        setIsCreatingNewList(false);
      },
      onError: (error) => {
        toastError(error || "Failed to create task");
      },
    });
  };

  if (!isCreatingNewList) {
    return (
      <div
        className="flex items-center justify-center gap-2 rounded-md py-1 hover:bg-muted-foreground/10 hover:cursor-pointer"
        onClick={() => setIsCreatingNewList(true)}
      >
        <Plus size="16" />
        New Task List
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
          Create Task List
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="ml-2 bg-muted hover:bg-foreground/10"
          onClick={() => setIsCreatingNewList(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskListCreate;
