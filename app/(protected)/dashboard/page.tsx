import { auth } from "@/auth";

export default async function DashboardHome() {
  const session = await auth();
  return <main className="">{JSON.stringify(session)}</main>;
}
