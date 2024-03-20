import CreateUserForm from "@/components/CreateUserForm";

export default function CreateUser(){

  return (
    <main className="pt-32 max-md:pt-4 flex justify-center ">

      <div className="max-w-[600px] bg-muted p-12 max-md:p-6 rounded-2xl">

     <CreateUserForm />
      </div>
    </main>
  )
}