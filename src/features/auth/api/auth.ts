import api from "../../../shared/api/axios";
import type { ApiSuccess } from "../../../shared/api/types";
import type { LoginValues, RegisterValues } from "../schema";

export type User = {
  id: string;
  name: string;
  email: string;
};

// The backend also sets the refresh token as an httpOnly cookie
export type AuthResponse = {
  accessToken: string;
  user: User;
};

export async function loginUser(values: LoginValues) {
  const { data } = await api.post<ApiSuccess<AuthResponse>>(
    "/auth/login",
    values,
  );
  return data.data;
}

export async function registerUser({ name, email, password }: RegisterValues) {
  // Send only these fields: the backend rejects unknown fields like confirmPassword
  const { data } = await api.post<ApiSuccess<AuthResponse>>("/auth/register", {
    name,
    email,
    password,
  });
  return data.data;
}

let refreshInFlight: Promise<AuthResponse> | null = null;

/**
 * Trades the refresh token cookie for a new access token.
 * Every caller shares ONE request: the backend rotates the cookie on each refresh,
 * and treats a second call with the old cookie as a stolen token (it ends the session).
 */
export function refreshSession() {
  refreshInFlight ??= api
    .post<ApiSuccess<AuthResponse>>("/auth/refresh")
    .then(({ data }) => data.data)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

export async function logoutUser() {
  await api.post("/auth/logout");
}
