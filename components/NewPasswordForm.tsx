"use client";
import { newPasswordSchema } from "@/lib/validationSchemas";
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
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import FormErrorComponent from "./FormErrorComponent";
import FormSuccessComponent from "./FormSuccessComponent.";
import login from "@/actions/login";
import { Eye, EyeOff } from "lucide-react";
import { newPassword, resetPassword } from "@/actions/reset-password";

export default function NewPasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      console.log(values);
      newPassword(values, token).then((data) => {
        if (data?.status === "success") {
          setSuccess(data.message);
        }
        if (data?.status === "error") {
          setError(data.message);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  ">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg max-sm:text-base">
                New Password
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
        <div className="flex justify-center">
          <Button
            type="submit"
            className="px-8 text-lg max-sm:text-base"
            disabled={isPending}
          >
            {isPending ? "Sigining In..." : "Submit"}
          </Button>
        </div>

        <FormErrorComponent errorMessage={error} />
        <FormSuccessComponent successMessage={success} />
      </form>
    </Form>
  );
}
