export type Status = "todo" | "in-process" | "done"
export type Priority = "low" | "medium" | "high"

export type TaskParams = Partial<{
  priority: Priority
  createdAt: Date
  dueDate: Date
}>

export type TaskPayload = {
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: Date
}
