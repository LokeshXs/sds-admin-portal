"use server";
import { z } from "zod";
import {
  newPasswordSchema,
  passwordResetSchema,
} from "@/lib/validationSchemas";
import db from "@/lib/db";
import { generateResetPasswordToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function resetPassword(
  values: z.infer<typeof passwordResetSchema>
) {
  try {
    //  1.) validate the email by zod

    const validatedData = passwordResetSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Email is not valid",
      };
    }

    const { email } = validatedData.data;

    // 2.) check if a user with the email exist

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        status: "error",
        message: "User not found",
      };
    }

    // 3.) Send email to user with the reset password link

    // 3.1) Generate the token and save into db
    const resetPasswordToken = await generateResetPasswordToken(email);

    // 3.2) Send email to user with reset password link

    await sendPasswordResetEmail(email, resetPasswordToken.token);

    return {
      status: "success",
      message: "Check your email to reset password",
    };
  } catch (err) {
    // console.log(err);
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}

export async function newPassword(
  values: z.infer<typeof newPasswordSchema>,
  token: string
) {
  try {
    // 1.) Validate the fields

    const validatedData = newPasswordSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Password is not valid",
      };
    }

    const { password } = validatedData.data;

    // 2.) validate if the token is valid
    const existingToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    if (!existingToken) {
      return {
        status: "error",
        message: "Invalid token!",
      };
    }

    const { email, expires } = existingToken;

    // 3.) check if the token is expired

    const isExpired = new Date(expires) < new Date();

    if (isExpired) {
      return {
        status: "error",
        message: "Token is expired!",
      };
    }

    // 4.) Hash the password and update the password in users table

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // 5) Delete the token from reset password  token table

    await db.passwordResetToken.delete({
      where: {
        token,
      },
    });

    return {
      status: "success",
      message: "Password is resetted successfully!",
    };
  } catch (err) {
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}
