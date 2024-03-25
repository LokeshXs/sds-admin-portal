"use client";
import { editUserSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import FormErrorComponent from "./FormErrorComponent";
import FormSuccessComponent from "./FormSuccessComponent.";
import { deleteUser, editUser } from "@/actions/createUser";
import { Eye, EyeOff, FilePenLine } from "lucide-react";
import { TableUserData } from "@/app/(protected)/dashboard/users/columns";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function EditUserForm({
  userInfo,
}: {
  userInfo: TableUserData;
}) {
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: userInfo.id,
      name: userInfo.name,
      username: userInfo.username,
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const onSubmit = (values: z.infer<typeof editUserSchema>) => {
    setError("");
    setSuccess("");
    setShowPassword(false);

    startTransition(() => {
      editUser(values).then((data) => {
        if (data?.status === "success") {
          setSuccess(data.message);
          setOpen(() => {
            setSuccess("");
            return false;
          });
          form.reset();
        }
        if (data?.status === "error") {
          setError(data.message);
        }
      });
    });
  };

  const deleteUserHandler = async () => {
    setError("");
    setSuccess("");

    startDeleteTransition(() => {
      deleteUser(userInfo.id).then((data) => {
        if (data?.status === "success") {
          setSuccess(data.message);
          setOpen(false);
        }
        if (data?.status === "error") {
          setError(data.message);
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-primary border-none text-primary-foreground hover:bg-primary hover:text-primary-foreground"
        >
          <FilePenLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  ">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Username"
                      type="hidden"
                      className="text-lg max-sm:text-base"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg max-sm:text-base">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Username"
                      type="text"
                      className="text-lg max-sm:text-base"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg max-sm:text-base">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Username"
                      type="text"
                      className="text-lg max-sm:text-base"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg max-sm:text-base">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter Password"
                        type={showPassword ? "text" : "password"}
                        className="text-lg max-sm:text-base pr-12"
                        disabled={isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={isPending}
                        className="absolute right-0 top-0 hover:bg-transparent "
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                        }}
                      >
                        {showPassword ? (
                          <Eye width={24} height={24} />
                        ) : (
                          <EyeOff width={24} height={24} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                className="px-8 text-lg max-sm:text-base bg-destructive hover:bg-destructive"
                disabled={isDeletePending}
                onClick={deleteUserHandler}
              >
                {isDeletePending ? "Deleting" : "Delete"}
              </Button>
              <Button
                type="submit"
                className="px-8 text-lg max-sm:text-base "
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            <FormErrorComponent errorMessage={error} />
            <FormSuccessComponent successMessage={success} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
