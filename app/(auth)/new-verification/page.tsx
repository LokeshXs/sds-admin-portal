import { newVerification } from "@/actions/verification";
import FormErrorComponent from "@/components/FormErrorComponent";
import FormSuccessComponent from "@/components/FormSuccessComponent.";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

export default async function NewVerification({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  const verificationStatus = await newVerification(token);

  let statusCard = <p>Fetching</p>;
  if (verificationStatus.status === "success") {
    statusCard = (
      <FormSuccessComponent successMessage={verificationStatus.message} />
    );
  } else if (verificationStatus.status === "error") {
    statusCard = (
      <FormErrorComponent errorMessage={verificationStatus.message} />
    );
  }

  return <main className=" min-h-screen flex items-center justify-center  p-6 max-sm:p-2  m-auto ">
    <Card className="w-[400px] flex flex-col gap-4 items-center bg-muted">
  <CardHeader>
    <CardTitle>Email Verification🕵️ </CardTitle>
   
  </CardHeader>
  <CardContent>
  {statusCard}
  </CardContent>
  <CardFooter>
    <Button>
      <Link href="/signin">Back to login</Link>
    </Button>
  </CardFooter>
</Card>
    </main>;
}
