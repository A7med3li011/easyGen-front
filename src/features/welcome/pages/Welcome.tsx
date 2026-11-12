import { Link } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import { useAuthStore } from "../../auth";

// The first page a user sees after login or register
function Welcome() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <Navbar />

      <main className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
        {/* Soft background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl sm:size-128"
        />

        <div className="w-full max-w-xl rounded-2xl border border-border bg-card px-6 py-10 text-center text-card-foreground shadow-xl shadow-primary/5 sm:px-10 sm:py-14">
          <div
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl"
          >
            👋
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Welcome to the application.
          </h1>

          {user && (
            <p className="mt-3 text-pretty text-muted-foreground">
              You're logged in as{" "}
              <span className="font-medium text-foreground">{user.name}</span>.
            </p>
          )}

          <Link
            to="/profile"
            className="mt-8 inline-block w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
          >
            View personal details
          </Link>
        </div>
      </main>
    </>
  );
}

export default Welcome;
