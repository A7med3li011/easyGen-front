import Spinner from "../../../shared/components/Spinner";

type Props = {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
};

// Shown when the profile couldn't be loaded at all
function ProfileError({ message, onRetry, isRetrying }: Props) {
  return (
    <div role="alert" className="flex flex-col items-center py-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertIcon />
      </div>
      <h2 className="mt-4 font-semibold">Couldn't load your details</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 font-medium transition hover:bg-muted disabled:opacity-60"
      >
        {isRetrying && <Spinner />}
        {isRetrying ? "Trying again..." : "Try again"}
      </button>
    </div>
  );
}

// Icon from Lucide (lucide.dev), inlined so we don't need an icon package
function AlertIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

export default ProfileError;
