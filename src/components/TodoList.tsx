"use client";

import { Todo } from "@/types/types";
import { useState } from "react";
import TodoItem from "./TodoItem";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Task 1",
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Task 2",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Task 3",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  return (
    <div>
      <ul className="mt-4 flex flex-col gap-4">
        {todos.map((todo) => (
          <li className="flex items-center gap-2" key={todo.id}>
            <TodoItem todo={todo} key={todo.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
