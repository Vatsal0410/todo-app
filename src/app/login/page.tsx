import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded bg-white p-6 shadow dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>

        <LoginForm />

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
