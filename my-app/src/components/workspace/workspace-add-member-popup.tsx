import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UserRole } from "@_types/roles.enum";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useWorkspaceStore from "@/store/workspace-store";
import { useAddWorkspaceMember } from "@/hooks/workspace-member-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";

const workspaceAddMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum([UserRole.MEMBER, UserRole.OWNER], "Role is required"),
});

type WorkspaceAddMemberFormData = z.infer<typeof workspaceAddMemberSchema>;

const WorkspaceAddMemberPopup = ({ trigger }: { trigger: React.ReactNode }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );

  const { mutate: addWorkspaceMember } = useAddWorkspaceMember();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<WorkspaceAddMemberFormData>({
    resolver: zodResolver(workspaceAddMemberSchema),
    defaultValues: {
      email: "",
      role: UserRole.MEMBER,
    },
  });

  const onSubmit = (data: WorkspaceAddMemberFormData) => {
    if (!currentWorkspaceId) {
      toastError("No workspace selected");
      return;
    }

    const payload = {
      email: data.email,
      role: data.role,
      workspaceId: currentWorkspaceId,
    };

    addWorkspaceMember(payload, {
      onSuccess: () => {
        setOpenDialog(false);
        toastSuccess("Member added successfully");
      },
      onError: (error) => {
        toastError(error || "Failed to add member");
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild className="flex justify-center items-center">
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Add a new member to your workspace. Enter their email and select a
              role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-4">
            <div className="grid gap-3">
              <Label htmlFor="email-1">Email</Label>
              <Input id="email-1" {...register("email")} required />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                      <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceAddMemberPopup;
