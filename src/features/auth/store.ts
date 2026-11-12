import { create } from "zustand";
import type { AuthResponse, User } from "./api/auth";

// "checking" = the app just started and the refresh call hasn't answered yet
export type AuthStatus = "checking" | "authenticated" | "guest";

type AuthState = {
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;
  setAuth: (auth: AuthResponse) => void;
  clearAuth: () => void;
  // After the user edits their details (the access token stays the same)
  updateUser: (user: User) => void;
};

// No `persist` on purpose: the access token stays in memory only.
// After a reload, the refresh token cookie gets a new one (see useRestoreSession).
export const useAuthStore = create<AuthState>()((set) => ({
  status: "checking",
  accessToken: null,
  user: null,
  setAuth: ({ accessToken, user }) =>
    set({ status: "authenticated", accessToken, user }),
  clearAuth: () => set({ status: "guest", accessToken: null, user: null }),
  updateUser: (user) => set({ user }),
}));
