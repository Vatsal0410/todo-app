import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded bg-white p-6 shadow dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-bold">Register</h1>

        <RegisterForm />

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
