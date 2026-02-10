import z from "zod";

export const todoTitleSchema = z
    .string()
    .trim()
    .min(1, "Todo title is required")
    .max(100, "Todo title must be less than 100 characters");

export const createTodoSchema = z.object({
    title: todoTitleSchema,
    dueDate: z
        .union([z.coerce.date(), z.null()])
        .optional(),
    priority: z.number().int().min(0).max(2).default(0),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>

export const updateTodoSchema = z.object({
    id: z.string().min(1),
    title: todoTitleSchema
})

export const archiveTodoSchema = z.object({
    id: z.string().min(1),
})

export const restoreTodoSchema = z.object({
    id: z.string().min(1)
})

export const toggleTodoSchema = z.object({
    id: z.string().min(1)
})
