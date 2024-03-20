"use client";

import { UserRole } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  MoreHorizontalIcon,
  FilePenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import db from "@/lib/db";
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
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-primary border-none text-primary-foreground hover:bg-primary hover:text-primary-foreground"><FilePenLine /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <EditUserForm userInfo={userinfo} />
      </DialogContent>
    </Dialog>
      );
    },
  },
];
