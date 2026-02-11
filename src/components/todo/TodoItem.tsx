import {
  archiveTodo,
  restoreTodo,
  toggleTodo,
  updateTodo,
} from "@/actions/todo.actions";
import { Todo } from "@/types/types";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import TodoEditInput from "./TodoEditInput";

function TodoItem({
  todo,
  setOptimisticTodos,
  archived = false,
}: {
  todo: Todo;
  archived?: boolean;
  setOptimisticTodos: (fn: (t: Todo[]) => Todo[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOverDue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  const priorityColor =
    todo.priority === 2
      ? "border-red-500 bg-red-100 text-red-700"
      : todo.priority === 1
        ? "border-yellow-500 bg-yellow-100 text-yellow-700"
        : "border-zinc-500 bg-zinc-100 text-zinc-700";

  const completedStyles = todo.completed ? "line-through" : "";

  // Toggle todo fn
  function handleToggle() {
    startTransition(() => {
      let previous: Todo[] = [];

      setOptimisticTodos((todos) => {
        previous = todos;
        return todos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t,
        );
      });

      toggleTodo(todo.id)
        .then(() => toast.success("Todo toggled"))
        .catch(() => {
          setOptimisticTodos(() => previous);
          toast.error("Failed to toggle todo");
        });
    });
  }

  // Update todo
  function hanldeSave(title: string) {
    let previous: Todo[] = [];
    if (!title.trim()) {
      toast.error("Todo title cannot be empty");
      return;
    }
    setOptimisticTodos((todos) => {
      previous = todos;
      return todos.map((t) => (t.id === todo.id ? { ...t, title } : t));
    });

    updateTodo(todo.id, title)
      .then(() => toast.success("Todo updated"))
      .catch(() => {
        setOptimisticTodos(() => previous);
        toast.error("Failed to update todo");
      });
    setIsEditing(false);
  }

  // Archive todo
  function handleArchive() {
    startTransition(() => {
      let previos: Todo[] = [];
      setOptimisticTodos((todos) => {
        previos = todos;
        return todos.filter((t) => t.id !== todo.id);
      });

      archiveTodo(todo.id)
        .then(() => toast.success("Todo archived"))
        .catch(() => {
          setOptimisticTodos(() => previos);
          toast.error("Failed to archive todo");
        });
    });
  }

  // Restore todo
  function handleRestore() {
    startTransition(() => {
      let previous: Todo[] = [];
      setOptimisticTodos((todos) => {
        previous = todos;
        return todos.filter((t) => t.id !== todo.id);
      });

      restoreTodo(todo.id)
        .then(() => toast.success("Todo restored"))
        .catch(() => {
          setOptimisticTodos(() => previous);
          toast.error("Failed to restore todo");
        });
    });
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN');
  }

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded border p-2 ${priorityColor} ${isOverDue ? "border-red-600 bg-red-200" : ""}`}
    >
      <div className="flex items-center gap-2">
        {!archived && (
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            disabled={isPending}
          />
        )}

        {isEditing ? (
          <TodoEditInput
            initialValue={todo.title}
            onSave={hanldeSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`cursor-text ${completedStyles}`}
          >
            {todo.title}
          </span>
        )}

        {todo.dueDate ? (
          <span
            className={`ml-2 text-xs ${isOverDue ? "text-red-600 font-semibold" : "text-zinc-500"}`}
          >
            {formatDate(todo.dueDate)}
          </span>
        ): (
          <span></span>
        )}
      </div>
      {!archived ? (
        <button
          onClick={handleArchive}
          disabled={isPending}
          className="text-sm text-red-500"
        >
          Archive
        </button>
      ) : (
        <button
          onClick={handleRestore}
          disabled={isPending}
          className="text-sm text-green-500"
        >
          Restore
        </button>
      )}
    </div>
  );
}

export default TodoItem;
