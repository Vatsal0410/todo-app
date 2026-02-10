"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        disabled={loading}
        className="rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
