import { z } from "zod";

// for registering new account
export const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and hyphens."),

  name: z.string().min(3, "Name must be at least 3 characters").max(30, "Name must be less than or equal to 30 characters"),

  age: z.preprocess((value) => {
    // Convert value to a number, if possible
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }, z.number().min(11, "Age must be at least 11").max(150, "Age must be less than or equal to 150")),

  email: z.string().email("Invalid email address."),

  password: z.string().min(4, "Password must be at least 4 characters"),
});

// for updating old account
export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, hyphens and underscores."),

  name: z.string().min(3, "Name must be at least 3 characters").max(30, "Name must be less than or equal to 30 characters"),

  age: z.preprocess((value) => {
    // Convert value to a number, if possible
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }, z.number().min(11, "Age must be at least 11").max(150, "Age must be less than or equal to 150")),

  email: z.string().email("Invalid email address."),
});
