import { auth } from "@/auth";
import CreateAdminForm from "@/components/CreateAdminForm";
import { redirect } from "next/navigation";

export default async function CreateAdmin() {
  const session = await auth();

  if(session?.user.role !== "SUPERADMIN"){
    redirect("/dashboard")
  }
  return (
    <main className="pt-32 max-md:pt-4 flex justify-center">
      <div className="max-w-[600px] bg-muted p-12 max-md:p-6 rounded-2xl ">
        <CreateAdminForm />
      </div>
    </main>
  );
}
