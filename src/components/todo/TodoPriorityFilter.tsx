"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { memo } from "react";

const OPTIONS = [
  { label: "All", value: undefined },
  { label: "Low", value: 0 },
  { label: "Medium", value: 1 },
  { label: "High", value: 2 },
];

function TodoPriorityFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("priority");

  function setPriority(value?: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === undefined) {
      params.delete("priority");
    } else {
      params.set("priority", value.toString());
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex justify-center gap-2 text-sm ">
      {OPTIONS.map((opt) => (
        <button
          key={opt.label}
          onClick={() => setPriority(opt.value)}
          className={`rounded border px-3 py-1 ${String(opt.value) === current  ? "bg-black text-white" : "bg-white text-black"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default memo(TodoPriorityFilter);
