import { z } from "zod";

// These rules match the backend UpdateUserDto (backend/src/users/dto)
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name")
    .max(100, "Name must be at most 100 characters"),
  email: z.email("Enter a valid email"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
