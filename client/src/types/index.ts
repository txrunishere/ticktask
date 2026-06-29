export type Status = "todo" | "in-progress" | "done" | "all"
export type Priority = "low" | "medium" | "high" | "all"
export type Order = "asc" | "desc"
export type SortBy = "priority" | "createdAt" | "dueDate"

export type TaskPayload = {
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: string | null
}

export type Filters = {
  status: Status
  priority: Priority
  search: string
  order: Order
  sortBy: SortBy
}

export type Task = {
  _id: string
  title: string
  description: string
  status: Status
  priority: Priority
  createdAt: Date
  dueDate: string
}
