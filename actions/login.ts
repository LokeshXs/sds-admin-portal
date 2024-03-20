"use server";
import { z } from "zod";
import { loginFormSchema } from "@/lib/validationSchemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export default async function login(values: z.infer<typeof loginFormSchema>) {
  const validatedFields = loginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid fields!",
    };
  }

  const { username, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      username,
      password,
      // redirectTo:DEFAULT_LOGIN_REDIRECT
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: "error",
            message: "Invalid Credentials!",
          };

        default:
          return {
            status: "error",
            message: "Something went wrong!",
          };
      }
    }

    throw error;
  }


  return {
    status: "error",
    message: "Something went wrong!",
  };
}
