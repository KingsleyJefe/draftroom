import { z } from "zod";

// create user
export const createUserSchema = z.object({
  state: z.string().min(2, "State is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
});
export type CreateUserDTO = z.infer<typeof createUserSchema>;