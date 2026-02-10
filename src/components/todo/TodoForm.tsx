"use client";

import { createTodo } from "@/actions/todo.actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function TodoForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get("title") as string) ?? "";
    const rawDueDate = formData.get("dueDate") as string;
    const priority = Number(formData.get("priority") ?? 0);

    if (!title.trim()) {
      toast.error("Todo title is required");
      return;
    }

    const dueDate =
      rawDueDate && rawDueDate.length > 0 ? new Date(rawDueDate) : null;

    if(formData) console.log(formData)

    startTransition(async () => {
      try {
        await createTodo({
          title,
          dueDate,
          priority,
        });

        toast.success("Todo added");
        form.reset();
      } catch (err: unknown) {
        if(err instanceof Error) toast.error(err.message);
        else toast.error("Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="title"
          placeholder="Type here"
          className="h-11 w-full rounded border p-2"
        />

        <input
          type="date"
          name="dueDate"
          className="h-11 w-full rounded border p-2 sm:w-auto"
        />

        <select
          name="priority"
          className="h-11 w-full rounded border p-2 sm:w-auto dark:bg-black"
        >
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </select>

        <button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded border p-2 sm:w-auto"
        >
          Add
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}
