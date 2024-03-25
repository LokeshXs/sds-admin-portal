import { auth } from "@/auth";

export default async function DashboardHome() {
  const session = await auth();
  return <main className="overflow-x-hidden">
    <h1 className="text-xl max-md:text-6xl max-sm:text-3xl">Coming soon</h1>
  </main>;
}
