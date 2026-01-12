import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import useProjectStore from "@/store/project-store";
import { useUpdateTaskList } from "@/hooks/list-hooks";

const taskListItemSchema = z.object({
  listTitle: z.string().min(1, "List title is required"),
});

type TaskListItemFormData = z.infer<typeof taskListItemSchema>;

const TaskListItemTitle = ({
  listTitle,
  listId,
}: {
  listTitle: string;
  listId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const { mutate: updateTaskListTitle } = useUpdateTaskList();

  const { register, handleSubmit, reset, watch } =
    useForm<TaskListItemFormData>({
      resolver: zodResolver(taskListItemSchema),
      defaultValues: {
        listTitle: listTitle,
      },
    });

  const title = watch("listTitle");

  const onSubmit = (data: TaskListItemFormData) => {
    if (!currentProjectId) return;

    const payload = {
      title: data.listTitle,
      projectId: currentProjectId,
    };

    updateTaskListTitle({ listId, payload });

    reset(data);
    setIsEditing(false);
  };

  return (
    <>
      {!isEditing && (
        <p
          className="font-semibold mb-2 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </p>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            autoFocus
            className="font-semibold mb-2"
            {...register("listTitle")}
            onBlur={handleSubmit(onSubmit)}
          />
        </form>
      )}
    </>
  );
};

export default TaskListItemTitle;
