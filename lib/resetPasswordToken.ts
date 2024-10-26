import db from "@/lib/db";

export const getresetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: {
        email,
      },
    });

    return resetToken;
  } catch (err) {
    return null;
  }
};

export const getresetPasswordTokenByToken = async (token: string) => {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return resetToken;
  } catch (err) {
    return null;
  }
};
