import { Toaster } from "sonner"
import { Header, TaskForm, Toolbar } from "./components"
import { useTasks } from "./hooks/useTasks"
import { useState } from "react"
import type { Task } from "./types"

export function App() {
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const onOpenCreateForm = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const onOpenEditingForm = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleFormOpenChange = (next: boolean) => {
    setFormOpen(next)
    if (!next) setEditingTask(null)
  }

  const {
    tasks,
    filters,
    loading,
    stats,
    resetFilters,
    createTask,
    updateTask,
    updateFilters,
    updateTaskStatus,
    deleteTask,
  } = useTasks()

  const hasActiveFilters = Boolean(
    filters.search.trim() ||
    filters.priority !== "all" ||
    filters.status !== "all"
  )

  return (
    <div className="min-h-screen px-6 py-8 pb-20">
      <div className="mx-auto max-w-6xl">
        <Header stats={stats} />

        <Toolbar
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onChange={updateFilters}
          onNewTask={onOpenCreateForm}
          onReset={resetFilters}
          resultCount={tasks.length}
        />

        <TaskForm
          editingTask={editingTask}
          onCreate={createTask}
          onOpenChange={handleFormOpenChange}
          onUpdate={updateTask}
          open={formOpen}
        />

        <Toaster richColors position="bottom-right" />
      </div>
    </div>
  )
}

export default App
