"use server";
import { z } from "zod";
import { createUserSchema, editUserSchema } from "@/lib/validationSchemas";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

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
        password: encryptedPassword,
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

    // 2.) update the db

    const updated = await db.user.update({
      where: {
        id: withoutEmptyStrData.id,
      },
      data: withoutEmptyStrData,
    });

    revalidatePath("/dashboard/users");
    return {
      status: "success",
      message: "User updated successfully",
    };
  } catch (err) {
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/users");
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
