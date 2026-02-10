"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      toast.message("Logging out...");
      signOut({ callbackUrl: "/login" });
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="rounded border px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
