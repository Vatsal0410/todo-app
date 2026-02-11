import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTodos } from "@/actions/todo.actions";
import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import TodoSort from "@/components/todo/TodoSort";
import TodoSearch from "@/components/todo/TodoSearch";
import TodoStatusFilter from "@/components/todo/TodoStatusFilter";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    sort?: string;
    order?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;

  const query =
    typeof params?.q === "string" && params.q.trim()
      ? params.q.trim()
      : undefined;

  const sort =
    params?.sort === "due" || params?.sort === "priority"
      ? params.sort
      : "created";

  const order =
    params?.order === "asc" || params?.order === "desc"
      ? params.order
      : undefined;

  const status =
    params?.status === "active" ||
    params?.status === "completed" ||
    params?.status === "archived"
      ? params.status
      : "all";

  // All todos
  const todos = await getTodos({ sort, order, query });
  // Active todos
  const activeTodos = todos.filter((t) => !t.completed);
  // Completed todos
  const completedTodos = todos.filter((t) => t.completed);
  // Archived todos
  const archivedTodos = await getTodos({ sort, order, query, archived: true });

  const showActive = status === "all" || status === "active";
  const showCompleted = status === "all" || status === "completed";
  const showArchived = status === "all" || status === "archived";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
        <TodoForm />

        <div className="flex gap-2 flex-col mt-6">
          <TodoSearch />
          <TodoSort value={sort} />
          <TodoStatusFilter />
        </div>

        {showActive && (
          <section className="space-y-6 mt-8">
            <h2 className="text-lg tracking-tight font-semibold">Active</h2>
            {activeTodos.length > 0 ? (
              <TodoList todos={activeTodos} />
            ) : (
              <p className="text-sm text-zinc-500">No active todos</p>
            )}
          </section>
        )}

        {showCompleted && (
          <section className="space-y-6 mt-8">
            <h2 className="text-lg tracking-tight font-semibold">Completed</h2>
            {completedTodos.length > 0 ? (
              <TodoList todos={completedTodos} />
            ) : (
              <p className="text-sm text-zinc-500">No completed todos</p>
            )}
          </section>
        )}

        {showArchived && (
          <section className="space-y-6 mt-8">
            <h2 className="text-lg tracking-tight font-semibold">Archived</h2>
            {archivedTodos.length > 0 ? (
              <TodoList todos={archivedTodos} archived />
            ) : (
              <p className="text-sm text-zinc-500">No archived todos</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
