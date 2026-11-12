import { isAxiosError } from "axios";
import type { ApiError } from "./types";

// Turns an API error into a message we can show in the UI.
export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiError>(error)) {
    if (!error.response) return "Can't reach the server. Please try again.";
    // The backend rate limit: 10 requests per minute per IP
    if (error.response.status === 429) {
      return "Too many attempts. Wait a minute and try again.";
    }

    // Validation errors: `message` is just "Validation failed", the useful text is in `details`
    const body = error.response.data;
    const detail = body?.details?.[0];
    if (detail) return detail;
    if (typeof body?.message === "string") return body.message;
  }

  return "Something went wrong. Please try again.";
}
