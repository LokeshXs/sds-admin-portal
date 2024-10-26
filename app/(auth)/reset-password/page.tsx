import PasswordResetForm from "@/components/PasswordResetForm";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function ResetPassword() {
  return (
    <main className=" min-h-screen flex items-center justify-center  p-6 max-sm:p-2  m-auto ">
      <section className="max-w-[1400px]  p-6 rounded-2xl">
        <div className="min-w-[500px] max-lg:min-w-[400px] max-sm:min-w-[352px] p-12 max-lg:p-6  rounded-2xl space-y-6 flex flex-col">
          <div className="flex flex-col items-center gap-4 justify-center ">
            <h2 className="text-4xl max-sm:text-3xl font-semibold  text-center">
              🔄️ Reset Password
            </h2>
            <p className="text-xl font-normal">Enter the registered mail id</p>
          </div>
          <div className="px-4 py-12 bg-muted rounded-2xl">
            <PasswordResetForm />
          </div>
          <Button asChild={true}>
            <Link href="/signin">Back to login</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
