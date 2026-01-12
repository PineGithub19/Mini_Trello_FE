import type { Task, TaskPayload } from "@/types/task";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { TaskPriority, TaskStatus } from "@/enums/tasks.enum";
import { useUpdateTask } from "@/hooks/task-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import useWorkspaceStore from "@/store/workspace-store";
import { useFetchMembersInWorkspace } from "@/hooks/workspace-member-hooks";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { extractInitial } from "@/lib/utils";
import TaskComment from "./task-comment";

const taskStatusOptions = Object.values(TaskStatus) as [
  TaskStatus,
  ...TaskStatus[]
];

const taskPriorityOptions = Object.values(TaskPriority) as [
  TaskPriority,
  ...TaskPriority[]
];

const taskDetailsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  status: z.enum(taskStatusOptions, {
    message: "Status is required",
  }),
  priority: z.enum(taskPriorityOptions, {
    message: "Priority is required",
  }),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .or(z.literal(""))
    .nullable(),
  assignedToId: z.string().optional().or(z.literal("")).nullable(),
});

type TaskDetailsFormValues = z.infer<typeof taskDetailsSchema>;

const TaskDetails = ({ task }: { task: Task }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskDetailsFormValues>({
    resolver: zodResolver(taskDetailsSchema),
    defaultValues: {
      title: task.title,
      status: task.status,
      priority: task.priority,
      description: task.description ?? "",
      assignedToId: task.assignedToId ?? "",
    },
  });

  const watchedAssigneeId = useWatch({ control, name: "assignedToId" });

  const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);

  const { data: members } = useFetchMembersInWorkspace(workspaceId || "");
  const { mutate: updateTask, isPending } = useUpdateTask(task.id);

  const normalizedSelectedAssigneeId =
    watchedAssigneeId && watchedAssigneeId !== ""
      ? watchedAssigneeId
      : undefined;

  const selectedMember = members?.data.find(
    (member) =>
      member.userId === normalizedSelectedAssigneeId ||
      member.userInformation.id === normalizedSelectedAssigneeId
  );

  useEffect(() => {
    reset({
      title: task.title,
      status: task.status,
      priority: task.priority,
      description: task.description ?? "",
      assignedToId: task.assignedToId ?? "",
    });
  }, [
    reset,
    task.description,
    task.priority,
    task.status,
    task.assignedToId,
    task.title,
  ]);

  useEffect(() => {
    if (!isEditingTitle) {
      return;
    }

    const input = titleInputRef.current;
    input?.focus();
    input?.select();
  }, [isEditingTitle]);

  const formatLabel = (value: string) =>
    value
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleUpdateTask = (patch: Partial<TaskPayload>) => {
    const payload: TaskPayload = {
      title: patch.title ?? task.title,
      listId: patch.listId ?? task.listId,
    };

    if (patch.description !== undefined) {
      payload.description = patch.description;
    }
    if (patch.status !== undefined) {
      payload.status = patch.status;
    }
    if (patch.priority !== undefined) {
      payload.priority = patch.priority;
    }
    if (patch.dueDate !== undefined) {
      payload.dueDate = patch.dueDate;
    }
    if (patch.createdById !== undefined) {
      payload.createdById = patch.createdById;
    }
    if (patch.assignedToId !== undefined) {
      payload.assignedToId = patch.assignedToId;
    }

    updateTask(payload, {
      onSuccess: () => {
        toastSuccess("Task updated successfully");
      },
      onError: (error) => {
        toastError(error);
      },
    });
  };

  const handleInvalid = (
    formErrors: FieldErrors<TaskDetailsFormValues>
  ): void => {
    const message =
      formErrors.title?.message ||
      formErrors.description?.message ||
      formErrors.status?.message ||
      formErrors.priority?.message ||
      formErrors.assignedToId?.message ||
      "Please fix validation errors before saving the task.";

    toastError(message);
  };

  const submitDiff = () => {
    if (isPending) {
      return;
    }

    handleSubmit((formValues) => {
      const patch: Partial<TaskPayload> = {};

      if (formValues.status !== task.status) {
        patch.status = formValues.status;
      }
      if (formValues.priority !== task.priority) {
        patch.priority = formValues.priority;
      }

      const nextTitle = formValues.title.trim();
      if (nextTitle !== task.title) {
        patch.title = nextTitle;
      }

      const normalizedAssignedToId =
        formValues.assignedToId && formValues.assignedToId !== ""
          ? formValues.assignedToId
          : undefined;
      const originalAssignedToId = task.assignedToId || undefined;
      if (normalizedAssignedToId !== originalAssignedToId) {
        patch.assignedToId = normalizedAssignedToId;
      }

      const nextDescription = formValues.description ?? "";
      if (nextDescription !== (task.description ?? "")) {
        patch.description = nextDescription;
      }

      if (!Object.keys(patch).length) {
        return;
      }

      handleUpdateTask(patch);
    }, handleInvalid)();
  };

  const handlePriorityChange = () => {
    submitDiff();
  };

  const handleStatusChange = () => {
    submitDiff();
  };

  const handleDescriptionBlur = () => {
    submitDiff();
  };

  const handleAssignedToIdChange = () => {
    submitDiff();
  };

  const renderMemberOption = (memberName: string, avatarUrl?: string) => (
    <span className="flex items-center gap-2">
      <Avatar className="size-6">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{extractInitial(memberName)}</AvatarFallback>
      </Avatar>
      <span className="truncate">{memberName}</span>
    </span>
  );

  return (
    <>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <div className="mb-4">
            {isEditingTitle ? (
              <Input
                {...field}
                ref={(node) => {
                  field.ref(node);
                  titleInputRef.current = node;
                }}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={() => {
                  field.onBlur();
                  setIsEditingTitle(false);
                  submitDiff();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                disabled={isPending}
                className="h-11 text-lg font-semibold"
              />
            ) : (
              <button
                type="button"
                className="w-full cursor-text bg-transparent text-left text-lg font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => {
                  if (!isPending) {
                    titleInputRef.current = null;
                    setIsEditingTitle(true);
                  }
                }}
              >
                {(field.value ?? "").trim() || "Untitled task"}
              </button>
            )}
            {errors.title?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>
        )}
      />
      <div className="flex items-stretch gap-6 border-t border-muted-foreground/10">
        <div className="flex w-[60%] flex-col gap-6 pt-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </span>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleStatusChange();
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger disabled={isPending} className="min-w-44">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskStatusOptions.map((statusOption) => (
                        <SelectItem key={statusOption} value={statusOption}>
                          {formatLabel(statusOption)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Priority
              </span>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handlePriorityChange();
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger disabled={isPending} className="min-w-44">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskPriorityOptions.map((priorityOption) => (
                        <SelectItem key={priorityOption} value={priorityOption}>
                          {formatLabel(priorityOption)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Members
              </span>
              <Controller
                control={control}
                name="assignedToId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleAssignedToIdChange();
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger disabled={isPending} className="min-w-56">
                      <SelectValue placeholder="Select member">
                        {selectedMember
                          ? renderMemberOption(
                              selectedMember.userInformation.name,
                              selectedMember.userInformation.avatar || undefined
                            )
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {members?.data.map((member) => {
                        const memberUserId =
                          member.userId || member.userInformation.id;

                        return (
                          <SelectItem key={memberUserId} value={memberUserId}>
                            {renderMemberOption(
                              member.userInformation.name,
                              member.userInformation.avatar || undefined
                            )}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assignedToId?.message && (
                <p className="text-xs text-destructive">
                  {errors.assignedToId.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </span>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  className="min-h-60"
                  placeholder="Type the task details..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={() => {
                    field.onBlur();
                    handleDescriptionBlur();
                  }}
                  disabled={isPending}
                />
              )}
            />
            {errors.description?.message && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        <aside className="flex w-[40%]">
          <div className="text-sm text-muted-foreground bg-muted pt-6 px-6 flex-1">
            <TaskComment />
          </div>
        </aside>
      </div>
    </>
  );
};

export default TaskDetails;
