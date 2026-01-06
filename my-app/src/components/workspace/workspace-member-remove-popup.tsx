import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useWorkspaceStore from "@/store/workspace-store";
import type { UserResponse } from "@/types/user";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useRemoveWorkspaceMember } from "@/hooks/workspace-member-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";

const workspaceMemberRemoveSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type WorkspaceMemberRemoveFormData = z.infer<
  typeof workspaceMemberRemoveSchema
>;

const WorkspaceMemberRemovePopup = ({
  member,
  trigger,
}: {
  member: UserResponse["data"];
  trigger: React.ReactNode;
}) => {
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );
  const currentWorkspaceName = useWorkspaceStore(
    (state) => state.currentWorkspaceName
  );
  const { mutate: removeMember, isPending } = useRemoveWorkspaceMember();

  const [openDialog, setOpenDialog] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceMemberRemoveFormData>({
    resolver: zodResolver(workspaceMemberRemoveSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = () => {
    if (!currentWorkspaceId) {
      return;
    }

    removeMember(
      {
        workspaceId: currentWorkspaceId,
        userId: member.id,
      },
      {
        onSuccess: () => {
          setOpenDialog(false);
          toastSuccess(`${member.name} has been removed from the workspace`);
        },
        onError: (error) => {
          toastError(error || "Failed to remove member");
        },
      }
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Remove a member from workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {member.name} ({member.email})
              from the workspace "{currentWorkspaceName}"?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Controller
                  name="acceptTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-destructive">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceMemberRemovePopup;
