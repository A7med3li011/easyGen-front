import { Route, Routes } from "react-router-dom";
import { Landing } from "./features/landing";
import {
  AuthLayout,
  GuestRoute,
  Login,
  ProtectedRoute,
  Register,
  useRestoreSession,
} from "./features/auth";
import { Profile } from "./features/profile";
import { Welcome } from "./features/welcome";
import NotFound from "./shared/pages/NotFound.tsx";

function App() {
  // Log back in from the refresh token cookie after a page reload
  useRestoreSession();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Login and register: logged-out users only, same layout */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Logged-in users only */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Any other URL shows the 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
