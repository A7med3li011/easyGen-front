import { useEffect } from "react";
import { refreshSession } from "../api/auth";
import { useAuthStore } from "../store";

/**
 * On app start: the access token is gone (it lived in memory),
 * but the refresh token cookie survives the reload. Use it to log back in.
 * StrictMode runs this twice in dev; refreshSession shares one request, so that's safe.
 */
export function useRestoreSession() {
  useEffect(() => {
    const { setAuth, clearAuth } = useAuthStore.getState();
    refreshSession().then(setAuth).catch(clearAuth);
  }, []);
}
