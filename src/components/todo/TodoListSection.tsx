import { memo, ReactNode } from "react";

function TodoListSection({
  title,
  children,
  length
}: {
  title: string;
  children: ReactNode;
  length: number
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between px-1">
        <h2 className="text-sm font-medium text-zinc-500">{title}</h2>
        <h2 className="text-sm font-medium text-zinc-500">{length}</h2>
      </div>
      {children}
    </div>
  );
}

export default memo(TodoListSection);
