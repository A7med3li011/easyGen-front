import { Outlet } from "react-router-dom";
import Logo from "../../../shared/components/Logo";

// Shared layout for the login and register pages.
// The current page is rendered inside the card through <Outlet />.
function AuthLayout() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Soft background glow */}
      <div className="absolute -top-40 left-1/2 -z-10 size-128 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-xl shadow-primary/5">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
