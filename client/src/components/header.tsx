import { Separator } from "./ui/separator"

type HeaderProps = {
  stats: {
    total: number
    done: number
    inProgress: number
    todo: number
    overDue: number
  }
}

type StatItemProps = {
  label: string
  value: number
}

const StatItem = ({ label, value }: StatItemProps) => (
  <div className="flex flex-col items-end gap-0.5">
    <span
      className={`font-mono text-xl leading-none font-semibold text-foreground`}
    >
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
      {label}
    </span>
  </div>
)

export const Header = ({ stats }: HeaderProps) => {
  return (
    <div className="mb-8">
      <header className="flex flex-wrap items-end justify-between gap-6 pb-6">
        <div className="flex items-center gap-3.5">
          <div>
            <h1 className="font-display text-2xl leading-tight font-bold tracking-tight">
              TickTask.
            </h1>
            <p className="text-sm text-muted-foreground">
              Task tracking, on signal
            </p>
          </div>
        </div>

        <div
          className="flex items-end gap-7"
          role="status"
          aria-label="Task overview"
        >
          <StatItem label="Total" value={stats.total} />
          <StatItem label="To Do" value={stats.todo} />
          <StatItem label="Active" value={stats.inProgress} />
          <StatItem label="Done" value={stats.done} />
          <StatItem label="Overdue" value={stats.overDue} />
        </div>
      </header>
      <Separator />
    </div>
  )
}
