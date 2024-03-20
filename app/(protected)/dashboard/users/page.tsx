import db from "@/lib/db";
import { DataTable } from "./data-table";
import { columns } from "./columns";



export default async function Users() {
  const usersData = await db.user.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
      role: true,
    },
  });

  console.log(usersData);

  return (
    <main>
     

      <DataTable columns={columns} data={usersData} />
      
    
    </main>
  );
}
