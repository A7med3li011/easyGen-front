// Grey placeholder shaped like the real profile card, shown while it loads.
// Sizes match the real content, so nothing jumps when the data arrives.
function ProfileSkeleton() {
  return (
    <div role="status" className="animate-pulse">
      <span className="sr-only">Loading your details...</span>

      {/* Header: avatar + name + member since */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="size-14 shrink-0 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 max-w-full rounded bg-muted" />
          <div className="h-3.5 w-52 max-w-full rounded bg-muted" />
        </div>
      </div>

      {/* Two fields: label + input */}
      <div className="mt-6 space-y-4">
        {["name", "email"].map((field) => (
          <div key={field}>
            <div className="mb-1.5 h-4 w-20 rounded bg-muted" />
            <div className="h-10.5 rounded-lg bg-muted" />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <div className="h-11 rounded-lg bg-muted sm:w-24" />
          <div className="h-11 rounded-lg bg-muted sm:w-36" />
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
