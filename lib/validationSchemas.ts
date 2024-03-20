import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});

// username should be betweem 4 - 20, must only contain small letters and numbers and _ and -, no spaces

export const createUserSchema = z.object({
  name: z.string().min(4, "Invalid value"),
  username: z.string().regex(/^[a-z0-9_-]{4,20}$/, "Username is invalid"),
  password: z
    .string()
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$|^$/,
      "Password is invalid"
    ),
});


export const editUserSchema = z.object({
  id:z.string().min(2),
  name: z.string(),
  username: z.string().regex(/^(?:[a-z0-9_-]{4,20})?$/, "Username is invalid"),
  password: z
    .string()
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$|^$/,
      "Password is invalid"
    ),
});


// ADMIN Creation validation Schema

export const createAdminSchema = z.object({
  name: z.string().min(4, "Invalid value"),
  username: z.string().regex(/^[a-z0-9_-]{4,20}$/, "Username is invalid"),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
      "Password is invalid"
    ),
});
