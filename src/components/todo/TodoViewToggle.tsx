"use client";

import { ViewMode } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { memo } from "react";

function TodoViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") === "grouped" ? "grouped" : "flat";

  function setView(next: ViewMode) {
    const params = new URLSearchParams(searchParams.toString());

    if(next === "flat") {
        params.delete("view");
    } else {
        params.set("view", "grouped");
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className='flex justify-center gap-2 text-sm'>
        <button onClick={() => setView("flat")} className={`rounded border px-3 py-1 ${view === "flat" ? "bg-black text-white" : "bg-white text-black"}`}>
            Flat
        </button>
        <button onClick={() => setView("grouped")} className={`rounded border px-3 py-1 ${view === "grouped" ? "bg-black text-white" : "bg-white text-black"}`}>
            By Date
        </button>
    </div>
  )
}

export default memo(TodoViewToggle)