"use client";
import { editUserSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import FormErrorComponent from "./FormErrorComponent";
import FormSuccessComponent from "./FormSuccessComponent.";
import { deleteUser, editUser } from "@/actions/createUser";
import { Eye, EyeOff } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";


export default function UserSetting({ userInfo }: { userInfo: any }) {


  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: userInfo?.id,
      name: userInfo?.name,
      username: userInfo?.username,
      email: userInfo?.email,
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof editUserSchema>) => {
    setError("");
    setSuccess("");
    setShowPassword(false);

    startTransition(() => {
      editUser(values).then((data) => {
        if (data?.status === "success") {
          setSuccess(data.message);

         
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
      deleteUser(userInfo.id).then(async(data)=>{
        if(data.status === "success"){
            await signOut();
        }

      });
    });
  };

  return (
    <Sheet
      onOpenChange={(prop) => {
        if (!prop) {
          setSuccess("");
          setError("");
        }
      }}
    >
      <SheetTrigger>
        <Avatar className="w-16 h-16">
          <AvatarImage src={userInfo.role === "ADMIN"?'/admindp.png':'/superadmindp.png'}  />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-sm:space-y-4  ">
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg max-sm:text-base ">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email id"
                      type="email"
                      className="text-lg max-sm:text-base "
                      disabled={isPending}
                      {...field}
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
            <div className="flex max-sm:flex-col-reverse justify-center gap-4">
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
      </SheetContent>
    </Sheet>
  );
}
