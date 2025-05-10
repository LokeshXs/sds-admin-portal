"use server";
import { z } from "zod";
import { loginFormSchema } from "@/lib/validationSchemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerficationToken } from "@/lib/tokens";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";

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
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: username,
          },
        ],
      },
    });

    if (existingUser?.role === "USER") {
      throw new Error("Something went wrong!");
    }

    // if (!existingUser?.emailVerified && existingUser?.email) {
    //   const verificationToken = await generateVerficationToken(
    //     existingUser?.email
    //   );
    //   await sendVerificationEmail(
    //     verificationToken.email,
    //     verificationToken.token
    //   );
    //   return {
    //     status: "success",
    //     message: "Confirmation email sent!",
    //   };
    // }

    await signIn("credentials", {
      username,
      password,
      // redirectTo:DEFAULT_LOGIN_REDIRECT
    });
    // console.log(res);
  } catch (error) {
    console.log(error);
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
