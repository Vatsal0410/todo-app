import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import LogoutButton from "../auth/LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl h-12 sm:h-14 items-center justify-between px-4">
        {/* Left */}
        <div className="text-base sm:text-lg font-semibold tracking-tight">
          Todo App
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-400 sm:block">
            {session.user.email}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
