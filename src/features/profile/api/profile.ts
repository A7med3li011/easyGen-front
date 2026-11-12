import api from "../../../shared/api/axios";
import type { ApiSuccess } from "../../../shared/api/types";
import type { ProfileValues } from "../schema";

// GET/PATCH /users/me return the raw user document inside `data`: the id is `_id`, not `id`
export type Profile = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export const myProfileQueryKey = ["users", "me"] as const;

export async function getMyProfile() {
  const { data } = await api.get<ApiSuccess<Profile>>("/users/me");
  return data.data;
}

// Send only the fields that changed: both are optional on the backend
export async function updateMyProfile(changes: Partial<ProfileValues>) {
  const { data } = await api.patch<ApiSuccess<Profile>>("/users/me", changes);
  return data.data;
}
