import { signOut } from "@/auth";
import DashboardLink from "@/components/DashboardLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";
import Link from "next/link";
import MobileDashboard from "@/components/MobileDashboard";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {

  const session = await auth();
  console.log(session?.user?.name)

  const isSuperAdmin = session?.user.role === "SUPERADMIN";

  return (
    <>
      <div className="w-full py-4 bg-muted flex justify-end px-6">
        <div className="flex gap-6 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>

          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      </div>
      <nav className="fixed top-0 left-0 h-screen p-4 w-60 bg-muted max-md:hidden">
        <div className="h-32 bg-primary rounded-sm flex items-center justify-center">
          <p className="text-6xl font-bold text-muted">SDS </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <DashboardLink href="/dashboard">Dashboard</DashboardLink>
          <DashboardLink href="/dashboard/users">User Data</DashboardLink>
          <DashboardLink href="/dashboard/createuser">
            Create User
          </DashboardLink>
          {isSuperAdmin && 
          <DashboardLink href="/dashboard/createadmin">
          Create Admin
        </DashboardLink>
          }
        </div>
      </nav>

      <MobileDashboard isSuperAdmin={isSuperAdmin} />

      <div className="py-4 pl-[288px] max-md:pl-4 pr-4 max-md:pb-20">{children}</div>
    </>
  );
}
