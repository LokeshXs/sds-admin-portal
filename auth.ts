// Configuration file for next-auth

import NextAuth from "next-auth";
import nextAuthConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import { UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });

      // Prevent signin without email verification
      if(!existingUser?.emailVerified){
        return false;
      }

      
      return true;
    },
    session({ token, session }) {
      // console.log(token);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user && token.username) {
        session.user.username = token.username as string;
        session.user.role = token.role as UserRole;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await db.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!existingUser) {
        return token;
      }
      token.username = existingUser.username;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...nextAuthConfig,
});
