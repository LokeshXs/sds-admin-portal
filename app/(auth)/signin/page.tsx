import SigninForm from "@/components/SigninForm";
import Image from "next/image";


export default function SignIn() {

  return (
    <main className=" min-h-screen flex items-center justify-center  p-6 max-sm:p-2  m-auto ">
      
      <section className="max-w-[1400px] w-full   flex max-md:flex-col max-md:gap-12 items-center justify-center bg-primary p-6 rounded-2xl">

      <div className="flex-[1]  min-w-[500px] max-lg:min-w-[400px] max-sm:min-w-[352px] p-12 max-lg:p-6  rounded-2xl space-y-6">


        <div className="flex flex-col items-center gap-4 justify-center ">
          <h2 className="text-4xl max-sm:text-3xl font-semibold text-muted text-center">🔐 Admin Panel Login</h2>
        
        </div>
        <div className="px-4 py-12 bg-muted rounded-2xl">
        <SigninForm />
        </div>
      </div>

      <div className="flex-[2] flex justify-center relative ">
       <Image src="/loginImage.jpg" alt="Worker" className="rounded-2xl" height={800} width={500}  />
       <div className="absolute inset-0 bg-gradient-to-b from-transparent  to-primary"></div>

       
      </div>

      </section>

    </main>
  )
}