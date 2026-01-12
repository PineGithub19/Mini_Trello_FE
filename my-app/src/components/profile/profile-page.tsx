import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Upload } from "lucide-react";

import { useFetchUserProfile, useUpdateUserProfile } from "@/hooks/user-hooks";
import { useUploadImage } from "@/hooks/file-hooks";
import { extractInitial } from "@/lib/utils";
import { toastError, toastSuccess } from "../custom-ui/toast-ui";
import DashboardHeader from "../dashboard/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const profileSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    avatarFile: z
      .any()
      .transform((value) => {
        if (value instanceof FileList) {
          return value.length ? value.item(0) : null;
        }
        return value instanceof File ? value : null;
      })
      .refine(
        (file) => !file || file.size <= MAX_AVATAR_SIZE,
        "Avatar must be smaller than 2MB"
      )
      .refine(
        (file) => !file || file.type.startsWith("image/"),
        "Avatar must be an image"
      ),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password.length < 8) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters",
      });
    }

    if (data.confirmPassword) {
      if (!data.password) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Enter a new password before confirming",
        });
      } else if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
        });
      }
    }
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const {
    data: user,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useFetchUserProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateUserProfile();
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();

  const [serverAvatarUrl, setServerAvatarUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      avatarFile: null,
      password: "",
      confirmPassword: "",
    },
  });

  const watchedAvatar = watch("avatarFile");

  const isActive = user?.data.isActive;

  useEffect(() => {
    if (user?.data) {
      reset({
        name: user.data.name ?? "",
        avatarFile: null,
        password: "",
        confirmPassword: "",
      });
      setServerAvatarUrl(user.data.avatar ?? null);
      setFileInputKey((prev) => prev + 1);
    }
  }, [reset, user?.data]);

  useEffect(() => {
    // `watch` returns the raw input value (FileList) while the resolver
    // transforms to `File`. Normalize here to a single `File | null`
    const file: File | null =
      watchedAvatar instanceof FileList
        ? watchedAvatar.length
          ? watchedAvatar.item(0)
          : null
        : watchedAvatar instanceof File
        ? watchedAvatar
        : null;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(serverAvatarUrl ?? null);
  }, [serverAvatarUrl, watchedAvatar]);

  const statusBadgeClass = useMemo(
    () =>
      isActive
        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
        : "bg-destructive/10 text-destructive border border-destructive/30",
    [isActive]
  );

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      let avatarUrl = serverAvatarUrl;

      if (values.avatarFile) {
        const formData = new FormData();
        formData.append("file", values.avatarFile);
        const { data: uploaded } = await uploadImage(formData);
        avatarUrl = uploaded.url;
      }

      const payload: {
        name: string;
        avatar?: string | null;
        password?: string;
      } = {
        name: values.name.trim(),
      };

      if (avatarUrl !== serverAvatarUrl) {
        payload.avatar = avatarUrl ?? null;
      }

      if (values.password) {
        payload.password = values.password;
      }

      await updateProfile(payload);

      toastSuccess("Profile updated successfully");

      setServerAvatarUrl(avatarUrl ?? null);
      reset({
        name: values.name.trim(),
        avatarFile: null,
        password: "",
        confirmPassword: "",
      });
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      toastError(error);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/10">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isProfileError || !user?.data) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/10">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Unable to load profile</CardTitle>
              <CardDescription>
                Please refresh the page or try again later.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <DashboardHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <section className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 sm:gap-6">
                <Avatar className="size-20 sm:size-24">
                  <AvatarImage
                    src={previewUrl ?? undefined}
                    alt="User avatar"
                  />
                  <AvatarFallback>
                    {extractInitial(user.data.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                      {user.data.name}
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {user.data.email}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium sm:text-sm ${statusBadgeClass}`}
                  >
                    <span
                      className={`size-2 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-destructive"
                      }`}
                    />
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and change your password when
                needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      {...register("name")}
                    />
                    <FieldError errors={[errors.name]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="avatarFile">Avatar</FieldLabel>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <label
                        htmlFor="avatarFile"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/40 bg-muted/40 px-4 py-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
                      >
                        <Upload className="size-4" />
                        <span>Upload image</span>
                      </label>
                      <Input
                        id="avatarFile"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        key={fileInputKey}
                        {...register("avatarFile")}
                      />
                      {previewUrl && (
                        <span className="text-xs text-muted-foreground">
                          Previewing selected avatar
                        </span>
                      )}
                    </div>
                    <FieldDescription>
                      Recommended square image, maximum 2MB.
                    </FieldDescription>
                    <FieldError errors={[errors.avatarFile]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">New password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Leave blank to keep current password"
                      {...register("password")}
                    />
                    <FieldDescription>
                      Minimum 8 characters. Leave blank if you do not want to
                      change it.
                    </FieldDescription>
                    <FieldError errors={[errors.password]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm new password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      {...register("confirmPassword")}
                    />
                    <FieldError errors={[errors.confirmPassword]} />
                  </Field>
                </FieldGroup>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isUpdating || isUploading}
                    onClick={() => {
                      reset({
                        name: user.data.name ?? "",
                        avatarFile: null,
                        password: "",
                        confirmPassword: "",
                      });
                      setPreviewUrl(serverAvatarUrl);
                      setFileInputKey((prev) => prev + 1);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating || isUploading || !isDirty}
                  >
                    {(isUpdating || isUploading) && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Save changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
