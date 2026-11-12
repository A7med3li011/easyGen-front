import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { useAuthStore } from "../store";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    // Clear the local session even if the request failed
    onSettled: () => {
      useAuthStore.getState().clearAuth();
      // Drop cached data (like the profile) so the next user never sees it
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}
