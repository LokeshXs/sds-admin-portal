"use client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { newVerification } from "@/actions/verification";
import FormErrorComponent from "./FormErrorComponent";
import FormSuccessComponent from "./FormSuccessComponent.";

export function NewVerificationForm({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = useCallback(() => {
    if(success || error) return;

    if (!token) {
      setError("Missing Token");
      return;
    }

    newVerification(token).then((res) => {
      if (res?.status === "success") {
        setSuccess(res.message);
      }

      if (res?.status === "error") {
        setError(res.message);
      }
    }).catch(()=>{
      setError("Something went wrong!");
    });
  }, [token,success,error]);

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirming your verification</CardTitle>
        <CardDescription className="text-center">
         <FormSuccessComponent successMessage={success} />
         <FormErrorComponent errorMessage={error} />
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/signin" className="w-full">
            Login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
