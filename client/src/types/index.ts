import type { AxiosError } from "axios"

export type TaskStatus = "todo" | "in-progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export type StatusFilter = TaskStatus | "all"
export type PriorityFilter = TaskPriority | "all"

export type Order = "asc" | "desc"

export type SortBy = "priority" | "createdAt" | "dueDate"

export type TaskPayload = Pick<
  Task,
  "title" | "description" | "status" | "priority" | "dueDate"
>

export type Task = {
  _id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  dueDate: string | null
}

export type Filters = {
  status: StatusFilter
  priority: PriorityFilter
  search: string
  order: Order
  sortBy: SortBy
}

export type AxiosApiError = AxiosError<{
  message: string
  status: "fail" | "error"
}>
