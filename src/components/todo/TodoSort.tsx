"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TodoSort({
  value,
}: {
  value: "created" | "due" | "priority";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  function update(params: URLSearchParams) {
    router.push(`/?${params.toString()}`);
  }

  function setSort(sort: "created" | "due" | "priority") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    if (!params.get("order")) {
      params.set("order", sort === "due" ? "asc" : "desc");
    }
    update(params);
  }

  function toggleOrder() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order", order === "asc" ? "desc" : "asc");
    update(params);
  }

  return (
    <div className="flex items-center justify-center gap-3 text-sm" title="Sort by">
      <div className="flex gap-2">
        {(["created", "due", "priority"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`rounded border px-3 py-1 ${value === key ? "bg-black text-white" : "bg-white text-black"}`}
          >
            {key === "created" ? "Created" : key === "due" ? "Due" : "Priority"}
          </button>
        ))}
      </div>
      <button className="rounded border px-3 py-1" title="Toggle order" onClick={toggleOrder}>
        {order === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>
  );
}
