"use server";
import db from "@/lib/db";
import { getVerificationTokenByToken } from "@/lib/verificationToken";

export async function newVerification(token: string) {
  try {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return {
        status: "error",
        message: "Token is invalid",
      };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return {
        status: "error",
        message: "Token has expired",
      };
    }

    const exisitingUser = await db.user.findUnique({
      where: {
        email: existingToken.email,
      },
    });

    if (!exisitingUser) {
      return {
        status: "error",
        message: "User does not exist",
      };
    }

    await db.user.update({
      where: {
        id: exisitingUser.id,
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return {
      status: "success",
      message: "Email verified",
    };
  } catch (err) {
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}
