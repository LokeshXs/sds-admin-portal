"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children:React.ReactNode
}
export default function DashboardLink({ href,children }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx("p-2   rounded-sm font-medium", {
        "bg-primary/20 text-primary": pathname === href,
        "hover:bg-gray-200/50": pathname !== href,
      })}
    >
      {children}
    </Link>
  );
}
