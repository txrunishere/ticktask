import { CircleDashed, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  hasFilters: boolean
  onNewTask: () => void
}

export const EmptyState = ({ hasFilters, onNewTask }: EmptyStateProps) => {
  if (hasFilters) {
    return (
      <div className="col-span-full flex flex-col items-center gap-2 py-20 text-center text-muted-foreground">
        <CircleDashed className="mb-1 h-9 w-9 text-muted-foreground/60" />
        <h2 className="font-display text-lg text-foreground">
          No tasks match these filters
        </h2>
        <p className="max-w-sm text-sm">
          Try a different search term, or clear the filters to see everything.
        </p>
      </div>
    )
  }

  return (
    <div className="col-span-full flex flex-col items-center gap-2 py-20 text-center text-muted-foreground">
      <CircleDashed className="mb-1 h-9 w-9 text-muted-foreground/60" />
      <h2 className="font-display text-lg text-foreground">
        Nothing on the board yet
      </h2>
      <p className="max-w-sm text-sm">
        Create your first task to start tracking it through to done.
      </p>
      <Button onClick={onNewTask} className="mt-2">
        <Plus className="h-4 w-4" />
        Create a task
      </Button>
    </div>
  )
}
