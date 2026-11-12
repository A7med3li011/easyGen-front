import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import Input from "../../../shared/components/Input";
import Navbar from "../../../shared/components/Navbar";
import Spinner from "../../../shared/components/Spinner";
import { getErrorMessage } from "../../../shared/api/errors";
import { useAuthStore } from "../../auth";
import {
  getMyProfile,
  myProfileQueryKey,
  updateMyProfile,
  type Profile as ProfileData,
} from "../api/profile";
import ProfileError from "../components/ProfileError";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { profileSchema, type ProfileValues } from "../schema";

function isEmailTaken(error: unknown) {
  return isAxiosError(error) && error.response?.status === 409;
}

// Retry only errors that can fix themselves (no connection, 5xx).
// A 4xx answer won't change, so show the error right away.
function shouldRetry(failureCount: number, error: Error) {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  const isClientError = status !== undefined && status < 500;
  return !isClientError && failureCount < 2;
}

function Profile() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: myProfileQueryKey,
    queryFn: getMyProfile,
    retry: shouldRetry,
  });
  const profile = profileQuery.data;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    resolver: zodResolver(profileSchema),
    // Fill the form once the profile loads. keepDirtyValues: a background
    // refetch (e.g. on window focus) doesn't wipe what the user is typing.
    values: profile ? { name: profile.name, email: profile.email } : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    // Errors are shown inside the form, not by the global toast in main.tsx
    meta: { skipGlobalErrorToast: true },
    onSuccess: (updated: ProfileData) => {
      queryClient.setQueryData(myProfileQueryKey, updated);
      // Keep the navbar name in sync
      useAuthStore.getState().updateUser({
        id: updated._id,
        name: updated.name,
        email: updated.email,
      });
      reset({ name: updated.name, email: updated.email });
      toast.success("Your details were saved.");
    },
    onError: (error) => {
      if (isEmailTaken(error)) {
        setError("email", { message: "This email already has an account" });
      }
    },
  });

  // 409 is shown under the email field; any other save error goes in the banner
  const saveError =
    updateMutation.isError && !isEmailTaken(updateMutation.error)
      ? getErrorMessage(updateMutation.error)
      : null;
  const isSaving = updateMutation.isPending;

  function onSubmit(values: ProfileValues) {
    // Send only what changed
    const changes: Partial<ProfileValues> = {};
    if (dirtyFields.name) changes.name = values.name;
    if (dirtyFields.email) changes.email = values.email;
    updateMutation.mutate(changes);
  }

  function cancel() {
    reset();
    updateMutation.reset(); // hide the error banner too
  }

  function renderContent() {
    // Data first: if a background refetch fails, keep showing the loaded form
    if (!profile) {
      if (profileQuery.isError) {
        return (
          <ProfileError
            message={getErrorMessage(profileQuery.error)}
            onRetry={() => profileQuery.refetch()}
            isRetrying={profileQuery.isFetching}
          />
        );
      }
      return <ProfileSkeleton />;
    }

    return (
      <>
        {/* Header: initial + name + member since */}
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary"
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{profile.name}</p>
            <p className="text-sm text-muted-foreground">
              Member since {formatDate(profile.createdAt)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6">
          {/* `disabled` on the fieldset locks every field while saving */}
          <fieldset disabled={isSaving} className="space-y-4">
            <Input
              label="Full name"
              id="name"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email"
              id="email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            {saveError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <span className="font-medium">Couldn't save your changes.</span>{" "}
                {saveError}
              </div>
            )}

            {/* Stacked on phones, right-aligned row from sm up */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancel}
                disabled={!isDirty}
                className="rounded-lg border border-border bg-card px-5 py-2.5 font-medium transition hover:bg-muted disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {isSaving && <Spinner />}
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </fieldset>
        </form>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Personal details
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your name and email address.
        </p>

        <div
          aria-busy={profileQuery.isPending || isSaving}
          className="mt-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl shadow-primary/5 sm:p-8"
        >
          {renderContent()}
        </div>
      </main>
    </>
  );
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default Profile;
