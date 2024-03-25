import db from "@/lib/db";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

type  UsersDataType = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  role: UserRole;
  createdAt: Date;
}[]

export default async function Users() {
  const session = await auth();
  console.log(session?.user.role);

let usersData:UsersDataType = [];

  if (session?.user.role === "SUPERADMIN") {
    // If the logged-in user is SUPERADMIN, fetch data for both ADMIN and USER
    usersData = await db.user.findMany({
      where: {
        OR: [
         
          { role: "USER" },
          {role:"ADMIN"}
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
        email:true,
        role: true,
      },
    });
  } else if (session?.user.role === "ADMIN") {
    // If the logged-in user is ADMIN, fetch data for USER and ADMIN
    usersData = await db.user.findMany({
      where: {
        OR: [
         
          { role: "USER" }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
        email:true,
        role: true,
      },
    });
  }

  return (
    <main>
      <DataTable columns={columns} data={usersData} />
    </main>
  );
}
