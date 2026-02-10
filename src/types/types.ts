export interface Todo {
  id: string
  userId: string

  title: string
  description: string | null
  completed: boolean
  completedAt: Date | null

  dueDate: Date | null
  priority: number

  archivedAt: Date | null

  createdAt: Date
  updatedAt: Date
}
