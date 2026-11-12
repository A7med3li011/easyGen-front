import { z } from "zod";

// These rules match the backend DTOs (backend/src/auth/dto)

// Strength rules apply to register only
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^A-Za-z\d]/, "Password must contain at least one special character");

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  // Like the backend LoginDto: only check it's filled in, the server compares the hash
  password: z
    .string()
    .min(1, "Enter your password")
    .max(64, "Password must be at most 64 characters"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter your name")
      .max(100, "Name must be at most 100 characters"),
    email: z.email("Enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
