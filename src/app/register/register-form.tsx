"use client";
import { registerUser } from "@/actions/auth.actions";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await registerUser({ name, email, password });
      await signIn("credentials", { email, password });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        type="text"
        placeholder="Name"
        required
        className="rounded border p-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="rounded border p-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="rounded border p-2"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        disabled={loading}
        className="rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Register"}
      </button>
    </form>
  );
}
