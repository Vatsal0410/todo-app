import { Todo } from "@/types/types";

function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div>
      <input type="checkbox" checked={todo.completed} />
      <span>{todo.title}</span>
    </div>
  );
}

export default TodoItem;
