"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TodoSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";

  const [value, setValue] = useState(initial);

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }

      router.push(`/?${params.toString()}`);
    }, 300);
    return () => clearTimeout(id);
  }, [value, router, searchParams]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Seach Todos..."
      className="w-full rounded border p-2"
    />
  );
}
