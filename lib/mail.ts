import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

  await resend.emails.send({
    from: "contact@ashwacreations.com",
    to: email,
    subject: "Confirmation Mail!",
    html: `<p>Click <a href="${confirmLink}" target="_blank">here</a> to confirm the account</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/new-password?token=${token}`;

  await resend.emails.send({
    from: "contact@ashwacreations.com",
    to: email,
    subject: "Reset Password",
    html: `<p>Click <a href="${resetLink}" target="_blank">here</a> to reset the password</p>`,
  });
};
