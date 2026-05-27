import { z } from "zod";

// Strict whitelisting prevents stored XSS (we never store HTML/punctuation
// in identifiers) and keeps SQL inputs to known-safe shapes. Even though
// queries are parameterized, validating shape is a useful second layer.

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(254)
  .email();

const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_.-]+$/, {
    message: "Username may contain letters, digits, _ . - only",
  });

const passwordSchema = z
  .string()
  .min(12, { message: "Password must be at least 12 characters" })
  .max(128, { message: "Password too long" })
  .refine((s) => /[a-z]/.test(s), "Must contain a lowercase letter")
  .refine((s) => /[A-Z]/.test(s), "Must contain an uppercase letter")
  .refine((s) => /[0-9]/.test(s), "Must contain a digit")
  .refine((s) => /[^a-zA-Z0-9]/.test(s), "Must contain a symbol");

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;
