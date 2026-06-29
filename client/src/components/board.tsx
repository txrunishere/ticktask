import type { StatusFilter, Task, TaskStatus } from "@/types"
import { EmptyState } from "./empty-state"
import { cn } from "@/lib/utils"
import { STATUS_LABELS, TaskCard } from "./task-card"

type BoardProps = {
  tasks: Task[]
  loading: boolean
  hasFilters: boolean
  onNewTask: () => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>
}

const COLUMNS = ["todo", "in-progress", "done"] as const

const COLUMNS_STYLE_CLASS: Record<(typeof COLUMNS)[number], string> = {
  todo: "bg-info",
  "in-progress": "bg-primary",
  done: "bg-success",
}

export const Board = ({
  tasks,
  loading,
  hasFilters,
  onNewTask,
  onEdit,
  onStatusChange,
  onDelete,
}: BoardProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div
            key={col}
            className="flex flex-col gap-3 rounded-xl border bg-card p-4"
          >
            <div className="h-5 w-2/5 animate-pulse rounded-md bg-secondary" />
            <div className="h-28 animate-pulse rounded-md bg-secondary" />
            <div className="h-28 animate-pulse rounded-md bg-secondary" />
          </div>
        ))}
        <span className="sr-only">Loading tasks…</span>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState hasFilters={hasFilters} onNewTask={onNewTask} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
      {COLUMNS.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status)
        return (
          <div
            key={status}
            className="flex flex-col gap-3 rounded-xl border bg-card p-4"
          >
            <div className="flex items-center gap-2 border-b pb-3">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  COLUMNS_STYLE_CLASS[status]
                )}
                aria-hidden="true"
              />
              <h2 className="font-display flex-1 text-sm font-semibold">
                {STATUS_LABELS[status]}
              </h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {columnTasks.length === 0 ? (
                <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                  No tasks here
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
