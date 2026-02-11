import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTodos } from "@/actions/todo.actions";
import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import TodoSort from "@/components/todo/TodoSort";
import TodoSearch from "@/components/todo/TodoSearch";
import TodoStatusFilter from "@/components/todo/TodoStatusFilter";
import TodoPriorityFilter from "@/components/todo/TodoPriorityFilter";
import { Todo, ViewMode } from "@/types/types";
import TodoListSection from "@/components/todo/TodoListSection";
import TodoViewToggle from "@/components/todo/TodoViewToggle";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    sort?: string;
    order?: string;
    q?: string;
    status?: string;
    priority?: string;
    view?: ViewMode;
  }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;

  const view = params?.view === "grouped" ? "grouped" : "flat";

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

  const priority =
    params?.priority === "0" ||
    params?.priority === "1" ||
    params?.priority === "2"
      ? Number(params.priority)
      : undefined;

  // All todos
  const todos = await getTodos({ sort, order, query, priority });
  // Active todos
  const activeTodos = todos.filter((t) => !t.completed);
  // Completed todos
  const completedTodos = todos.filter((t) => t.completed);
  // Archived todos
  const archivedTodos = await getTodos({
    sort,
    order,
    query,
    archived: true,
    priority,
  });

  const showActive = status === "all" || status === "active";
  const showCompleted = status === "all" || status === "completed";
  const showArchived = status === "all" || status === "archived";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overDue: Todo[] = [];
  const todayDue: Todo[] = [];
  const upComing: Todo[] = [];
  const noDueDate: Todo[] = [];

  for (const todo of activeTodos) {
    if (!todo.dueDate) {
      noDueDate.push(todo);
      continue;
    }
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);

    if (due.getTime() < today.getTime()) overDue.push(todo);
    else if (due.getTime() === today.getTime()) todayDue.push(todo);
    else upComing.push(todo);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
        <TodoForm />

        <div className="flex gap-2 flex-col mt-6">
          <TodoSearch />
          <TodoSort value={sort} />
          <TodoStatusFilter />
          <TodoPriorityFilter />
          <TodoViewToggle />
        </div>

        {showActive && (
          <section className="space-y-6 mt-8">
            <div className="flex justify-between px-1">
              <h2 className="text-lg tracking-tight font-semibold">Active</h2>
              <h2 className="text-lg tracking-tight font-semibold">
                {activeTodos.length}
              </h2>
            </div>

            {view === "flat" &&
              (activeTodos.length > 0 ? (
                <TodoList todos={activeTodos} />
              ) : (
                <p className="text-sm text-zinc-500">No active todos</p>
              ))}

            {view === "grouped" && (
              <>
                {overDue.length > 0 && (
                  <TodoListSection title="Overdue" length={overDue.length}>
                    <TodoList todos={overDue} />
                  </TodoListSection>
                )}

                {todayDue.length > 0 && (
                  <TodoListSection title="Today" length={todayDue.length}>
                    <TodoList todos={todayDue} />
                  </TodoListSection>
                )}

                {upComing.length > 0 && (
                  <TodoListSection title="Upcoming" length={upComing.length}>
                    <TodoList todos={upComing} />
                  </TodoListSection>
                )}

                {noDueDate.length > 0 && (
                  <TodoListSection
                    title="No Due Date"
                    length={noDueDate.length}
                  >
                    <TodoList todos={noDueDate} />
                  </TodoListSection>
                )}
              </>
            )}
          </section>
        )}

        {showCompleted && (
          <section className="space-y-6 mt-8">
            <div className="flex justify-between px-1">
              <h2 className="text-lg tracking-tight font-semibold">Complete</h2>
              <h2 className="text-lg tracking-tight font-semibold">
                {completedTodos.length}
              </h2>
            </div>
            {completedTodos.length > 0 ? (
              <TodoList todos={completedTodos} />
            ) : (
              <p className="text-sm text-zinc-500">No completed todos</p>
            )}
          </section>
        )}

        {showArchived && (
          <section className="space-y-6 mt-8">
            <div className="flex justify-between px-1">
              <h2 className="text-lg tracking-tight font-semibold">Archived</h2>
              <h2 className="text-lg tracking-tight font-semibold">
                {archivedTodos.length}
              </h2>
            </div>
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
