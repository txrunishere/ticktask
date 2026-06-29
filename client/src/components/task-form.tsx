import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Priority, Status, Task, TaskPayload } from "@/types"
import type { AxiosApiError } from "@/api/task.api"

type TaskFormProps = {
  open: boolean
  editingTask: Task | null
  onOpenChange: (next: boolean) => void
  onCreate: (payload: TaskPayload) => Promise<void>
  onUpdate: (id: string, payload: TaskPayload) => Promise<void>
}

type Form = {
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: string
}

type FormError = Partial<Omit<Form, "status" | "priority"> & { form: string }>

type InputFormField = "title" | "description" | "dueDate"

type SelectFormField = "status" | "priority"

const EMPTY_FORM: Form = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
}

const toDateInputValue = (dateStr: string) => {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

const validate = (form: Form) => {
  const errors: FormError = {}
  const title = form.title.trim()

  if (!title) {
    errors.title = "Title is required"
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters"
  } else if (title.length > 100) {
    errors.title = "Title cannot exceed 100 characters"
  }

  if (form.description && form.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters"
  }

  if (form.dueDate) {
    const due = new Date(form.dueDate)
    if (Number.isNaN(due.getTime())) {
      errors.dueDate = "That date doesn't look valid"
    }

    if (new Date(form.dueDate) < new Date()) {
      errors.dueDate = "Due data can't be less than current date"
    }
  }

  return errors
}

export const TaskForm = ({
  open,
  editingTask,
  onOpenChange,
  onCreate,
  onUpdate,
}: TaskFormProps) => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<FormError>({})
  const [submitting, setSubmitting] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const isEditing = Boolean(editingTask)

  useEffect(() => {
    if (open) {
      if (editingTask) {
        setForm({
          title: editingTask.title || "",
          description: editingTask.description || "",
          status: editingTask.status || "todo",
          priority: editingTask.priority || "medium",
          dueDate: toDateInputValue(editingTask.dueDate),
        })
      } else {
        setForm(EMPTY_FORM)
      }
      setErrors({})
      const id = setTimeout(() => firstFieldRef.current?.focus(), 80)
      return () => clearTimeout(id)
    }
  }, [open, editingTask])

  const handleChange =
    (field: InputFormField) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value.trim() }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleSelectChange = (field: SelectFormField) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  console.log(errors)

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    }

    setSubmitting(true)
    try {
      if (isEditing && editingTask) {
        await onUpdate(editingTask._id, payload)
      } else {
        await onCreate(payload)
      }
      onOpenChange(false)
    } catch (err) {
      const error = err as AxiosApiError
      setErrors({ form: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-110">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {errors.form && (
            <div className="rounded-md border border-destructive bg-destructive/15 px-3 py-2 text-sm text-destructive">
              {errors.form}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              ref={firstFieldRef}
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Refactor the onboarding flow"
              maxLength={100}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <span className="text-xs text-destructive">{errors.title}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <span className="text-xs text-muted-foreground">
                {form.description.trim().length}/500
              </span>
            </div>
            <Textarea
              id="description"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Add any helpful context (optional)"
              rows={4}
              maxLength={500}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <span className="text-xs text-destructive">
                {errors.description}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={handleSelectChange("status")}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={handleSelectChange("priority")}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange("dueDate")}
              aria-invalid={!!errors.dueDate}
            />
            {errors.dueDate && (
              <span className="text-xs text-destructive">{errors.dueDate}</span>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving…"
                : isEditing
                  ? "Save changes"
                  : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
