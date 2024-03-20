"use server";
import { createAdminSchema } from "@/lib/validationSchemas";
import { z } from "zod";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createAdmin(values: z.infer<typeof createAdminSchema>) {
  try {
    const validatedFields = createAdminSchema.safeParse(values);

    console.log(validatedFields);

    if (!validatedFields.success) {
      return {
        status: "error",
        message: "Invalid fields!",
      };
    }

    const { name, password, username, email } = validatedFields.data;
    // 1.) check if the admin with the provided username and email exist in db

    const user = await db.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (user) {
      return {
        status: "error",
        message: "Admin with the username or email id already exist",
      };
    }

    // 2.)Encrypt the password

    const encryptedPassword = await bcrypt.hash(password, 10);

    console.log(encryptedPassword);

    // 3.) Create user in db

    await db.user.create({
      data: {
        name,
        username,
        email,
        role: "ADMIN",
        password: encryptedPassword,
      },
    });

    return {
      status: "success",
      message: "Admin created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}
