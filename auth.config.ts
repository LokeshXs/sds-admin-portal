import credentials from "next-auth/providers/credentials";
import { loginFormSchema } from "./lib/validationSchemas";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    credentials({
      async authorize(credentials) {
        const validatedFields = loginFormSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;

          const user = await db.user.findFirst({
            where: {
              OR: [{ username: username }, { email: username }],
            },
          });

          if (!user || !user.password) {
            return null;
          }

          if (user.role === "USER") {
            return null;
          }

          // const isPasswordMatched = await bcrypt.compare(
          //   password,
          //   user.password
          // );

           const isPasswordMatched = password === user.password;

          if (isPasswordMatched) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
