import { auth } from "@/auth";

export default async function DashboardHome() {
  const session = await auth();
  return <main className="overflow-x-hidden">
    <h1 className="text-8xl max-md:text-6xl max-sm:text-3xl">Coming Soon</h1>
  </main>;
}
