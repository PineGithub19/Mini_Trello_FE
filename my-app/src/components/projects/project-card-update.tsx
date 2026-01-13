import { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useProjectStore from "@/store/project-store";
import NotificationDialog from "../custom-ui/notification-dialog";
import useWorkspaceStore from "@/store/workspace-store";
import {
  useFetchProjectById,
  useUpdateProjectById,
} from "@/hooks/project-hooks";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useFetchDefaultBackgroundList,
  useUploadImage,
} from "@/hooks/file-hooks";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";

const MAX_BACKGROUND_SIZE = 5 * 1024 * 1024; // 5MB

const projectCardUpdateSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  defaultBackground: z.string().optional(),
  background: z
    .any()
    .transform((value) => {
      if (value instanceof FileList) {
        return value.length ? value.item(0) : null;
      }
      return value instanceof File ? value : null;
    })
    .refine(
      (file) => !file || file.size <= MAX_BACKGROUND_SIZE,
      "Background must be smaller than 5MB"
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "Background must be an image"
    ),
});

type ProjectCardUpdateFormData = z.infer<typeof projectCardUpdateSchema>;

const ProjectCardUpdate = () => {
  const currentWorkspace = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );
  const currentProject = useProjectStore((state) => state.currentProjectId);
  const { data: project } = useFetchProjectById(currentProject || "");
  const { data: defaultBackgrounds } = useFetchDefaultBackgroundList();
  const { mutateAsync: uploadImage } = useUploadImage();
  const { mutate: updateProject } = useUpdateProjectById(currentProject || "");

  const [serverBackgroundUrl, setServerBackgroundUrl] = useState<string | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<ProjectCardUpdateFormData>({
    resolver: zodResolver(projectCardUpdateSchema),
    defaultValues: {
      name: project?.data.name || "",
      description: project?.data.description || "",
      background: null,
    },
  });

  const watchedBackground = watch("background");

  useEffect(() => {
    if (project?.data) {
      reset({
        name: project.data.name ?? "",
        description: project.data.description ?? "",
        background: null,
      });
      setServerBackgroundUrl(project.data.background || null);
      setPreviewUrl(null);
      setFileInputKey((prev) => prev + 1); // Reset file input
    }
  }, [reset, project?.data]);

  useEffect(() => {
    // `watch` returns the raw input value (FileList) while the resolver
    // transforms to `File`. Normalize here to a single `File | null`
    const file: File | null =
      watchedBackground instanceof FileList
        ? watchedBackground.length
          ? watchedBackground.item(0)
          : null
        : watchedBackground instanceof File
        ? watchedBackground
        : null;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(serverBackgroundUrl ?? null);
  }, [serverBackgroundUrl, watchedBackground]);

  const onSubmit = async (values: ProjectCardUpdateFormData) => {
    try {
      let backgroundUrl = serverBackgroundUrl;

      if (values.background && values.background instanceof File) {
        const formData = new FormData();
        formData.append("file", values.background);
        const { data: uploaded } = await uploadImage(formData);
        backgroundUrl = uploaded.url;
      } else if (typeof values.defaultBackground === "string") {
        backgroundUrl = values.defaultBackground;
      } else {
        backgroundUrl = null;
      }

      const payload: {
        name: string;
        description?: string;
        background?: string;
        workspaceId?: string;
      } = {
        name: values.name.trim(),
        description: values.description?.trim(),
        workspaceId: currentWorkspace || "",
      };

      if (backgroundUrl !== serverBackgroundUrl) {
        payload.background = backgroundUrl ?? "";
      }

      await updateProject(payload);

      toastSuccess("Project updated successfully");

      setServerBackgroundUrl(backgroundUrl ?? null);
      reset({
        name: values.name.trim(),
        background: null,
        defaultBackground: undefined,
      });
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <NotificationDialog
      triggerElement={<span>Project Details</span>}
      title="Project Details"
      description="Details"
      cancelText="Cancel"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="project-name" className="font-medium">
              Project Name
            </Label>
            <Input id="project-name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="project-description" className="font-medium">
              Project Description
            </Label>
            <Input id="project-description" {...register("description")} />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="project-background" className="font-medium">
              Project Background
            </Label>
            <Input
              id="project-background"
              type="file"
              accept="image/*"
              key={fileInputKey}
              {...register("background")}
            />
            {errors.background && (
              <p className="text-xs text-destructive mt-1">
                {errors.background.message}
              </p>
            )}
            {defaultBackgrounds && (
              <div className="mt-2 flex flex-wrap gap-2">
                {defaultBackgrounds.data.map((bgUrl) => (
                  <img
                    key={bgUrl.name}
                    src={bgUrl.url}
                    alt="Default Background"
                    className="h-16 w-24 object-cover cursor-pointer border-2 border-transparent hover:border-primary"
                    onClick={() => {
                      setPreviewUrl(bgUrl.url);

                      setValue("defaultBackground", bgUrl.url, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                ))}
              </div>
            )}
            {previewUrl && (
              <div className="mt-4 max-w-md max-h-md">
                <img src={previewUrl} alt="Project Background Preview" />
              </div>
            )}
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full">
          Save Changes
        </Button>
      </form>
    </NotificationDialog>
  );
};

export default ProjectCardUpdate;
