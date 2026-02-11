"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { memo } from "react";

const STATUSES = ["all", "active", "completed", "archived"] as const;

type Status = (typeof STATUSES)[number];

function TodoStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = (searchParams.get("status") as Status) ?? "all";

  function setStatus(status: Status) {
    const params = new URLSearchParams(searchParams.toString());

    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/?${params.toString()}`);
  }
  return (
    <div className="flex justify-center gap-2 text-sm">
      {STATUSES.map((status) => (
        <button
          onClick={() => setStatus(status)}
          key={status}
          className={`rounded border px-3 py-1 capitalize ${current === status ? "bg-black text-white" : "bg-white text-black"}`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

export default memo(TodoStatusFilter);
