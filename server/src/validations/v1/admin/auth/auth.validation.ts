import { z } from "zod";

export const registerSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),

  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birthdate must be in YYYY-MM-DD format")
    .transform((val) => new Date(val)),
  mobileNumber: z.string().min(7, "Mobile number is too short").max(20, "Mobile number is too long"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender must be Male, Female, or Other",
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
