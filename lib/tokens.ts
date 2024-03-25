import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "./verificationToken";
import db from "@/lib/db";
import { getresetPasswordTokenByEmail } from "./resetPasswordToken";

export const generateVerficationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    const updatedVerificationToken = await db.verificationToken.update({
      where: {
        email,
      },
      data: {
        token,
        expires,
      },
    });

    return updatedVerificationToken;
  }

  const newVerificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return newVerificationToken;
};

export async function generateResetPasswordToken(email: string) {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getresetPasswordTokenByEmail(email);
console.log(existingToken);
  if (existingToken) {
    const updatedResetToken = await db.passwordResetToken.update({
      where: {
        email,
      },
      data: {
        token,
        expires,
      },
    });

    return updatedResetToken;
  }

  const newResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return newResetToken;
}
