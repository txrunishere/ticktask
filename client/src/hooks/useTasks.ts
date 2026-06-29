import { taskapi, type AxiosApiError } from "@/api/task.api"
import type { Filters, Status, Task, TaskPayload } from "@/types"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

const DEFAULT_FILTERS: Filters = {
  status: "all",
  priority: "all",
  search: "",
  order: "desc",
  sortBy: "createdAt",
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [loading, setLoading] = useState<boolean>(false)
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
    try {
      let params: Partial<Filters> = {}

      if (filters.status !== "all") params.status = filters.status
      if (filters.priority !== "all") params.priority = filters.priority
      if (filters?.search.trim()) params.search = filters.search.trim()
      params.sortBy = filters.sortBy
      params.order = filters.order

      const result = await taskapi.getTasks(params)
      setTasks(result.data.tasks)
    } catch (error) {
      const err = error as AxiosApiError
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [
    filters.order,
    filters.sortBy,
    filters.status,
    filters.priority,
    filters.search,
  ])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = useCallback(async (payload: TaskPayload) => {
    try {
      const created = await taskapi.create(payload)
      setTasks((prev) => [...prev, created])
      toast.success(`Task ${created.data.task.title} created`)
    } catch (error) {
      const err = error as AxiosApiError
      toast.error(err.message)
    }
  }, [])

  const updateTask = useCallback(async (id: string, payload: TaskPayload) => {
    try {
      const updated = await taskapi.update(id, payload)
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated.data.task : t))
      )
      toast.success(`Task ${updated.data.task.title} updated`)
    } catch (error) {
      const err = error as AxiosApiError
      toast.error(err.message)
    }
  }, [])

  const updateTaskStatus = useCallback(async (id: string, status: Status) => {
    let previous: Task
    setTasks((prev) =>
      prev.map((t) => {
        if (t._id === id) {
          previous = t
          return { ...t, status }
        }
        return t
      })
    )

    try {
      const updated = await taskapi.updateStatus(id, status)
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated.data.task : t))
      )
    } catch (error) {
      setTasks((prev) => prev.map((t) => (t._id === id ? previous : t)))
      const err = error as AxiosApiError
      toast.error(err.message)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    const target = tasks.find((t) => t._id === id)
    setTasks((prev) => prev.filter((t) => t._id !== id))
    try {
      await taskapi.delete(id)
      toast.success(`Task ${target?.title || "item"} deleted`)
    } catch (error) {
      if (target) {
        setTasks((prev) => [...prev, target])
      }
      const err = error as AxiosApiError
      toast.error(err.message)
    }
  }, [])

  return {
    tasks,
    loading,
    filters,
    stats,
    resetFilters,
    updateFilters,
    refetch: fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  }
}
