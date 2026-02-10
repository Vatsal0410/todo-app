import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTodos } from "@/actions/todo.actions";
import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import TodoSort from "@/components/todo/TodoSort";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ sort?: string; order?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;

  const sort =
    params?.sort === "due" || params?.sort === "priority"
      ? params.sort
      : "created";

  const order =
    params?.order === "asc" || params?.order === "desc"
      ? params.order
      : undefined;

  const todos = await getTodos({ sort, order });
  const archivedTodos = await getTodos({ archived: true });

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
        <TodoForm />

        <div className="mt-6">
          <TodoSort value={sort} />
        </div>

        <section className="space-y-6 mt-8">
          <h2 className="text-lg tracking-tight font-semibold">Active</h2>
          {activeTodos.length === 0 ? (
            <p className="text-sm text-zinc-500">No active todos</p>
          ) : (
            <TodoList todos={activeTodos} />
          )}
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-lg tracking-tight font-semibold">Completed</h2>
          {completedTodos.length === 0 ? (
            <p className="text-sm text-zinc-500">No completed todos</p>
          ) : (
            <TodoList todos={completedTodos} />
          )}
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-lg tracking-tight font-semibold">Archived</h2>
          {archivedTodos.length === 0 ? (
            <p className="text-sm text-zinc-500">No archived todos</p>
          ) : (
            <TodoList todos={archivedTodos} archived />
          )}
        </section>
      </main>
    </div>
  );
}
