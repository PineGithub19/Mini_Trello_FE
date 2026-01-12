import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTaskStore } from "@/store/task-store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateTaskComment, useFetchTaskComments } from "@/hooks/task-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { extractInitial, formatDateTime } from "@/lib/utils";

const taskCommentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

type TaskCommentFormData = z.infer<typeof taskCommentSchema>;

const TaskComment = () => {
  const taskId = useTaskStore((state) => state.task.taskId);

  const { data: taskComments } = useFetchTaskComments(taskId || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCommentFormData>({
    resolver: zodResolver(taskCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const { mutate: createComment } = useCreateTaskComment();

  const onSubmit = (data: TaskCommentFormData) => {
    if (!taskId) return;

    createComment(
      {
        content: data.comment,
        taskId: taskId,
      },
      {
        onSuccess: () => {
          toastSuccess("Comment added successfully");
        },
        onError: (error) => {
          toastError(error || "Failed to add comment");
        },
      }
    );
  };

  return (
    <div>
      <p className="mb-4">Comment and Activity</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <Input
          placeholder="Add a comment..."
          className="bg-background"
          {...register("comment")}
        />
        {errors.comment && (
          <p className="text-destructive text-sm mt-1">
            {errors.comment.message}
          </p>
        )}
        <Button type="submit" className="hidden" />
      </form>
      <div className="max-h-[30vh] overflow-y-auto">
        {taskComments?.data.map((comment) => (
          <div
            key={comment.id}
            className="mb-2 p-2 border-b border-border flex items-center gap-2"
          >
            <div>
              <Avatar className="size-6 ring-2 ring-background mb-2">
                <AvatarImage
                  src={comment.userInformation.avatar || undefined}
                />
                <AvatarFallback>
                  {extractInitial(comment.userInformation.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(comment.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskComment;
