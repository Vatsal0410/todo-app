"use client";

import { useEffect, useState, useTransition } from "react";
import { Todo } from "@/types/types";
import TodoItem from "./TodoItem";

export default function TodoList({
  todos,
  archived = false,
}: {
  todos: Todo[];
  archived?: boolean;
}) {
  const [optimisticTodos, setOptimisticTodos] = useState(todos);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setOptimisticTodos(todos);
    });
  }, [todos, startTransition]);

  return (
    <ul className="mt-4 flex flex-col gap-4">
      {optimisticTodos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            key={todo.id}
            todo={todo}
            archived={archived}
            setOptimisticTodos={setOptimisticTodos}
          />
        </li>
      ))}
    </ul>
  );
}
