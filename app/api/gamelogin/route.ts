import { z } from "zod";
import db from "@/lib/db";
import bcrytp from "bcryptjs";

const bodySchema = z.object({
  username: z.string().min(2),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validateBody = bodySchema.safeParse(body);
    if (!validateBody.success) {
      throw new Error("Invalid Inputs!");
    }

    const data = validateBody.data;

    const userDetails = await db.user.findUnique({
      where: {
        username: data.username,
      },
      select: {
        email: true,
        username: true,
        name: true,
        image: true,
        password: true,
      },
    });

    if (!userDetails) {
      throw new Error("Something went wrong!");
    }

    const verifyPassword = await bcrytp.compare(
      data.password,
      userDetails.password
    );

    if (!verifyPassword) {
      throw new Error("Incorrect username/password");
    }

    return Response.json({
      status: "success",
      message: "Successfully logged in",
      data: {
        email: userDetails.email,
        username: userDetails.username,
        name: userDetails.name,
        image: userDetails.image,
      },
    });
  } catch (err: any) {
    if (err.message) {
      return Response.json({
        status: "error",
        message: err.message,
      });
    }
    return Response.json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}
