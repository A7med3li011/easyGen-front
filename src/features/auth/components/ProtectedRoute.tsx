import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

// Pages only for logged-in users (profile, ...).
// A logged-out user is sent to the login page instead.
function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);

  // Still checking the refresh cookie: don't redirect to /login too early
  if (status === "checking") return null;
  if (status === "guest") return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
