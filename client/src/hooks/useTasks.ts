import { taskapi, type AxoisApiError } from "@/api/task.api"
import type { Filters, Task } from "@/types"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

const DEFAULT_FILTERS: Filters = {
  search: "",
  order: "desc",
  priority: "all",
  status: "all",
  sortBy: "createdAt",
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      done: tasks.filter((t) => t.status === "done").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      todo: tasks.filter((t) => t.status === "todo").length,
      overDue: tasks.filter(
        (t) =>
          t.dueDate && t.status !== "done" && new Date(t.dueDate) < new Date()
      ).length,
    }
  }, [tasks])

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  const updateFilters = useCallback(
    (patch: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...patch })),
    []
  )

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params: Partial<Filters> = {}

      if (filters.status !== "all") params.status = filters.status
      if (filters.priority !== "all") params.priority = filters.priority
      if (filters.search.trim()) params.search = filters.search
      params.sortBy = filters.sortBy
      params.order = filters.order

      const result = await taskapi.getTasks(params)
      setTasks(result.data.tasks)
    } catch (error) {
      const err = error as AxoisApiError
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    tasks,
    loading,
    error,
    filters,
    stats,
    resetFilters,
    updateFilters,
    fetchTasks,
  }
}
