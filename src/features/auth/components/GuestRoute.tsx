import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

// Pages only for logged-out users (login, register).
// A logged-in user is sent to the welcome page instead.
function GuestRoute() {
  const status = useAuthStore((state) => state.status);

  // Still checking the refresh cookie: render nothing, so the form doesn't flash
  if (status === "checking") return null;
  if (status === "authenticated") return <Navigate to="/app" replace />;
  return <Outlet />;
}

export default GuestRoute;
