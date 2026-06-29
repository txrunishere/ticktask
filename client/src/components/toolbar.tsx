import { useEffect, useState } from "react"
import { Search, Plus, ArrowUp, ArrowDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Filters, Priority, SortBy, Status } from "@/types"

type ToolbarProps = {
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
  onNewTask: () => void
  resultCount: number
  hasActiveFilters: boolean
}

export const Toolbar = ({
  filters,
  onChange,
  onReset,
  onNewTask,
  resultCount,
  hasActiveFilters,
}: ToolbarProps) => {
  const [debounceSearch, setDebounceSearch] = useState(filters.search)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (debounceSearch !== filters.search) {
        onChange({ search: debounceSearch })
      }
    }, 350)
    return () => clearTimeout(timeout)
  }, [debounceSearch])

  return (
    <div className="mb-7 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-md min-w-55 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks by title…"
            value={debounceSearch}
            onChange={(e) => setDebounceSearch(e.target.value)}
            aria-label="Search tasks"
            className="pl-9"
          />
        </div>

        <Button onClick={onNewTask} className="ml-auto">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[0.65rem] tracking-wider text-muted-foreground">
            FILTER
          </span>

          <Select
            value={filters.status}
            onValueChange={(v: Status) => onChange({ status: v })}
          >
            <SelectTrigger className="h-8 w-35 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(v: Priority) => onChange({ priority: v })}
          >
            <SelectTrigger className="h-8 w-35 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <span className="ml-2 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
            SORT
          </span>

          <Select
            value={filters.sortBy}
            onValueChange={(v: SortBy) => onChange({ sortBy: v })}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="dueDate">Due date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onChange({ order: filters.order === "asc" ? "desc" : "asc" })
            }
            aria-label={`Sort order: ${filters.order === "asc" ? "ascending" : "descending"}`}
            title={filters.order === "asc" ? "Ascending" : "Descending"}
          >
            {filters.order === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {resultCount} shown
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onReset
                setDebounceSearch("")
              }}
              className="h-7 px-2 text-primary hover:text-primary"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
