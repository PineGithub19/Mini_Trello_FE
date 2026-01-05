import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFetchDefaultBackgroundList } from "@/hooks/file-hooks";
import { cn } from "@/lib/utils";
import { useCreateProject } from "@/hooks/project-hooks";
import useWorkspaceStore from "@/store/workspace-store";
import { useState } from "react";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";

const projectCreateSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  background: z.string().url("Invalid background URL"),
});

type ProjectCreateFormData = z.infer<typeof projectCreateSchema>;

const ProjectCreatePopup = ({ trigger }: { trigger: React.ReactNode }) => {
  const { data: defaultImages } = useFetchDefaultBackgroundList();
  const { mutate: createProject } = useCreateProject();
  const [openDialog, setOpenDialog] = useState(false);

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectCreateFormData>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      name: "My Awesome Project",
      background:
        defaultImages && defaultImages.data.length > 0
          ? defaultImages.data[0].url
          : "",
    },
  });

  const currentBackground = watch("background");

  const onSubmit = (data: ProjectCreateFormData) => {
    const payload = {
      ...data,
      workspaceId: currentWorkspaceId || "",
    };

    createProject(payload, {
      onSuccess: () => {
        toastSuccess("Project created successfully");
        setOpenDialog(false);
      },
      onError: (error) => {
        toastError(error || "Failed to create project");
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
          <DialogHeader className="mb-4">
            <DialogTitle>Create new project</DialogTitle>
            <DialogDescription>
              Create a new project in your workspace here. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" {...register("name")} required />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Project Description</Label>
              <Input id="description" {...register("description")} required />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label>Background</Label>
              {defaultImages &&
                Array.isArray(defaultImages.data) &&
                defaultImages.data.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {defaultImages.data.map((image) => (
                      <div
                        key={image.name}
                        className={cn(
                          "relative rounded-md overflow-hidden border-2 cursor-pointer transition-all",
                          currentBackground === image.url
                            ? "border-primary"
                            : "border-transparent hover:border-primary/50"
                        )}
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="object-cover w-full h-24"
                        />
                        <input
                          type="radio"
                          value={image.url}
                          {...register("background")}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          aria-label={`Select ${image.name} background`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              {errors.background && (
                <p className="text-destructive text-sm mt-1">
                  {errors.background.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreatePopup;
