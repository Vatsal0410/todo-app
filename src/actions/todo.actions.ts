"use server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createTodoSchema,
  updateTodoSchema,
  toggleTodoSchema,
  archiveTodoSchema,
  restoreTodoSchema,
} from "@/validation/todo.schema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

// Get the user's id
export async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

// Create a new todo
export async function createTodo(input: z.infer<typeof createTodoSchema>) {
  const userId = await getUserId();

  const result = createTodoSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { title, dueDate, priority } = result.data;

  const safeDueDate = dueDate && dueDate.getTime() > 0 ? dueDate : null;

  const todo = prisma.todo.create({
    data: {
      title,
      userId,
      dueDate: safeDueDate,
      priority: priority ?? 0,
      archivedAt: null,
    },
  });
  revalidatePath("/");
  return todo;
}

// Update a todo
export async function updateTodo(todoId: string, title: string) {
  const userId = await getUserId();

  const result = updateTodoSchema.safeParse({
    id: todoId,
    title,
  });

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const todo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
      archivedAt: null,
    },
  });

  if (!todo) {
    throw new Error("Todo not found");
  }

  const updated = prisma.todo.update({
    where: { id: todoId },
    data: { title },
  });

  revalidatePath("/");
  return updated;
}

// Toggle a todo
export async function toggleTodo(todoId: string) {
  const userId = await getUserId();

  const result = toggleTodoSchema.safeParse({
    id: todoId,
  });

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const todo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
      archivedAt: null,
    },
  });

  if (!todo) {
    throw new Error("Todo not found");
  }

  const updated = prisma.todo.update({
    where: { id: todoId },
    data: {
      completed: !todo.completed,
      completedAt: todo.completed ? null : new Date(),
    },
  });

  revalidatePath("/");
  return updated;
}

// Archive a todo
export async function archiveTodo(todoId: string) {
  const userId = await getUserId();

  const result = archiveTodoSchema.safeParse({
    id: todoId,
  });

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const todo = prisma.todo.updateMany({
    where: {
      id: todoId,
      userId,
      archivedAt: null,
    },
    data: { archivedAt: new Date() },
  });

  revalidatePath("/");

  return todo;
}

// restore a todo
export async function restoreTodo(todoId: string) {
  const userId = await getUserId();

  const result = restoreTodoSchema.safeParse({
    id: todoId,
  });

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const todo = prisma.todo.updateMany({
    where: {
      id: todoId,
      userId,
      archivedAt: { not: null },
    },
    data: { archivedAt: null },
  });

  revalidatePath("/");

  return todo;
}

// Get all todos
export async function getTodos({
  archived = false,
  sort = "created",
  order,
  query
}: {
  archived?: boolean;
  sort?: "created" | "due" | "priority";
  order?: "asc" | "desc";
  query?: string
}) {
  const userId = await getUserId();

  const baseWhere = {
    userId,
    archivedAt: archived ? { not: null } : null,
    ...(query ? {
      title: {
        contains: query,
        mode: "insensitive" as const,
      }
    } : {})
  };

  const direction = order ?? (sort === "due" ? "asc" : "desc")

  // Sort by due date
  if (sort === "due") {
    const activeWithDue = await prisma.todo.findMany({
      where: {
        ...baseWhere,
        completed: false,
        dueDate: { not: null },
      },
      orderBy: { dueDate: direction },
    });

    const activeWithoutDue = await prisma.todo.findMany({
      where: {
        ...baseWhere,
        completed: false,
        dueDate: null,
      },
      orderBy: { createdAt: "desc" },
    });

    const completed = await prisma.todo.findMany({
      where: {
        ...baseWhere,
        completed: true,
      },
      orderBy: { completedAt: "desc" },
    });

    return [...activeWithDue, ...activeWithoutDue, ...completed];
  }

  // Sort by priority
  if (sort === "priority") {
    const active = await prisma.todo.findMany({
      where: { ...baseWhere, completed: false },
      orderBy: [{ priority: "desc" }, { createdAt: direction }],
    });

    const completed = await prisma.todo.findMany({
      where: { ...baseWhere, completed: true },
      orderBy: [{ completedAt: "desc" }],
    });

    return [...active, ...completed];
  }

  // default created
  const active = await prisma.todo.findMany({
    where: { ...baseWhere, completed: false },
    orderBy: { createdAt: direction },
  });

  const completed = await prisma.todo.findMany({
    where: { ...baseWhere, completed: true },
    orderBy: { completedAt: "desc" },
  });

  return [...active, ...completed];
}
