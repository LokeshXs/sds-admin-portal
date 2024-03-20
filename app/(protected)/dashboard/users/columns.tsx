"use client";

import { UserRole } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  FilePenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditUserForm from "@/components/EditUserForm";

export type TableUserData = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  createdAt: Date;
};

export const columns: ColumnDef<TableUserData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NAME
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: "USERNAME",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "role",
    header: "ROLE",
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right"> DATE CREATED</div>,
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      const formatted = date.toLocaleDateString();

      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userinfo = row.original;

      return (
        <EditUserForm userInfo={userinfo} />
      );
    },
  },
];
