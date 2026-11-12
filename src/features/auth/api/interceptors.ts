import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import api from "../../../shared/api/axios";
import { useAuthStore } from "../store";
import { refreshSession } from "./auth";

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean };

// Call once at startup (main.tsx)
export function installAuthInterceptors() {
  // Add the access token to every request
  api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  // Access token expired (401) → refresh once, then retry the same request
  api.interceptors.response.use(undefined, async (error: AxiosError) => {
    const request = error.config as RetriableRequest | undefined;
    // A 401 from /auth/* is a real answer (wrong password, bad cookie): don't retry it
    const isAuthRoute = request?.url?.startsWith("/auth/");

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retried ||
      isAuthRoute
    ) {
      throw error;
    }

    request._retried = true;
    try {
      useAuthStore.getState().setAuth(await refreshSession());
    } catch {
      useAuthStore.getState().clearAuth();
      throw error;
    }
    // The request interceptor adds the NEW token
    return api(request);
  });
}
