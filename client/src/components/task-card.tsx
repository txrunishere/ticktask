import { useState } from "react"
import { AlertTriangle, Pencil, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Task, TaskStatus } from "@/types"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>
}

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
}

const formatDate = (date: string | null) => {
  if (!date) return null

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

const isOverdue = (date: string | null, status: TaskStatus) => {
  if (!date || status === "done") return false

  return new Date(date) < new Date(new Date().toDateString())
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const overdue = isOverdue(task.dueDate, task.status)

  const handleDeleteClick = async () => {
    if (confirmingDelete) {
      await onDelete(task._id)
      return
    }

    setConfirmingDelete(true)

    setTimeout(() => {
      setConfirmingDelete(false)
    }, 2500)
  }

  return (
    <Card
      className={cn(
        "flex overflow-hidden p-0 transition-opacity",
        task.status === "done" && "opacity-60"
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="tracking-wide uppercase">
            {PRIORITY_LABELS[task.priority]}
          </Badge>

          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 font-mono text-xs text-muted-foreground",
                overdue && "font-semibold text-destructive"
              )}
            >
              {overdue && <AlertTriangle className="h-3 w-3" />}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h3
            className={cn(
              "text-sm leading-snug font-semibold",
              task.status === "done" && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Select
            value={task.status}
            onValueChange={(value) =>
              onStatusChange(task._id, value as TaskStatus)
            }
          >
            <SelectTrigger
              className="h-8 w-auto rounded-full px-3 text-xs"
              aria-label={`Status for ${task.title}`}
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              aria-label={
                confirmingDelete
                  ? `Confirm delete ${task.title}`
                  : `Delete ${task.title}`
              }
              className={cn(
                "h-8 transition-all",
                confirmingDelete
                  ? "w-auto bg-destructive/10 px-2 text-destructive hover:bg-destructive/20"
                  : "w-8"
              )}
            >
              {confirmingDelete ? (
                <span className="text-xs font-medium">Sure?</span>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
