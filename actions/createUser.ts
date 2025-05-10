"use server";
import { z } from "zod";
import { createUserSchema, editUserSchema } from "@/lib/validationSchemas";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { signOut } from "next-auth/react";
import { generateVerficationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export default async function createUser(
  values: z.infer<typeof createUserSchema>
) {
  try {
    const validatedFields = createUserSchema.safeParse(values);

    console.log(validatedFields);

    if (!validatedFields.success) {
      return {
        status: "error",
        message: "Invalid fields!",
      };
    }

    const { name, password, username } = validatedFields.data;
    // 1.) check if the user with the provided username exist in db

    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      return {
        status: "error",
        message: "Username already exist",
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
        password: password,
      },
    });

    return {
      status: "success",
      message: "User created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}

export async function editUser(values: z.infer<typeof editUserSchema>) {
  type EditUserType = z.infer<typeof editUserSchema>;
  const session = await auth();
  try {
    const validatedFields = editUserSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        status: "error",
        message: "Invalid fields!",
      };
    }

    // 1.) if the field is empty remove
    const withoutEmptyStrData: any = {};
    Object.keys(validatedFields.data).map((key) => {
      // console.log(validatedFields.data[key as keyof EditUserType]);
      const value = validatedFields.data[key as keyof EditUserType];
      if (value !== "") {
        withoutEmptyStrData[key as keyof EditUserType] = value;
      }
    });

    // 2.) hash the password if present
    if (withoutEmptyStrData.password) {
      const hashedPassword = await bcrypt.hash(
        withoutEmptyStrData.password,
        10
      );

      withoutEmptyStrData.password = hashedPassword;
    }

    // 3.) Check if the logged in user is changing email
    if (withoutEmptyStrData?.email) {
      const existingUser = await db.user.findUnique({
        where: {
          id: withoutEmptyStrData.id,
        },
      });

      if (existingUser?.email !== withoutEmptyStrData.email) {
        // check if the chaged email is already in db

        const isChangesEmailAlreadyUsed = await db.user.findUnique({
          where: {
            email: withoutEmptyStrData.email,
          },
        });

        if (isChangesEmailAlreadyUsed) {
          return {
            status: "error",
            message: "User with the email already exist",
          };
        }
        // // Put the verfied to null
        // await db.user.update({
        //   where: {
        //     id: withoutEmptyStrData.id,
        //   },
        //   data: {
        //     emailVerified: null,
        //   },
        // });

        // send verification email

        const verificationToken = await generateVerficationToken(
          withoutEmptyStrData.email
        );

        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        );

        await db.user.update({
          where: {
            id: withoutEmptyStrData.id,
          },
          data: withoutEmptyStrData,
        });

        return {
          status: "success",
          message: "Confirmation email sent!",
        };
      }
    }

    // 2.) update the db

    const updated = await db.user.update({
      where: {
        id: withoutEmptyStrData.id,
      },
      data: withoutEmptyStrData,
    });
    if (session?.user.id !== withoutEmptyStrData.id) {
      revalidatePath("/dashboard/users");
    }
    return {
      status: "success",
      message: "User updated successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}

export async function deleteUser(id: string) {
  const session = await auth();
  try {
    await db.user.delete({
      where: {
        id,
      },
    });
    if (session?.user.id !== id) {
      revalidatePath("/dashboard/users");
    }
    return {
      status: "success",
      message: "User deleted successfully",
    };
  } catch (err) {
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}
