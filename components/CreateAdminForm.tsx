"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createAdminSchema } from "@/lib/validationSchemas";
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
import { Input } from "@/components/ui/input";
import { createAdmin } from "@/actions/createAdmin";
import { useState, useTransition } from "react";
import FormErrorComponent from "./FormErrorComponent";
import FormSuccessComponent from "./FormSuccessComponent.";
import { Eye, EyeOff } from 'lucide-react';



export default function CreateAdminForm() {
  const form = useForm<z.infer<typeof createAdminSchema>>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  function onSubmit(values: z.infer<typeof createAdminSchema>) {
    setError("");
    setSuccess("");
    setShowPassword(false);
    startTransition(() => {
      createAdmin(values).then((res) => {
        if (res?.status === "success") {
          setSuccess(res.message);
        }

        if (res?.status === "error") {
          setError(res.message);
        }
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg max-sm:text-base ">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full Name"
                  type="text"
                  className="text-lg max-sm:text-base "
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your Full Name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg max-sm:text-base ">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Username"
                  type="text"
                  className="text-lg max-sm:text-base "
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
              username can only contain small case alpha numeric
                characters,-,_
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg max-sm:text-base ">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email id"
                  type="email"
                  className="text-lg max-sm:text-base "
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter Email id
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg max-sm:text-base ">Password</FormLabel>
              <FormControl>
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="text-lg max-sm:text-base "
                  disabled={isPending}
                  {...field}
                />
                <Button type="button" size="icon" variant="ghost" disabled={isPending} className="absolute right-0 top-0 hover:bg-transparent " onClick={()=>{
                  setShowPassword((prev)=>!prev)
                }}>
               {showPassword? <Eye width={24} height={24} />:<EyeOff width={24} height={24} />}
                </Button>
                </div>
              </FormControl>
              <FormDescription>
              Password must have least 8 characters and must have at least one
                number, small case letter, uppercase letter and special
                character
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button type="submit" className="text-lg max-sm:text-base " disabled={isPending}>
            {isPending ? "Creating Admin..." : "Create Admin"}
          </Button>
        </div>
        <FormErrorComponent errorMessage={error} />
        <FormSuccessComponent successMessage={success} />
      </form>
    </Form>
  );
}
