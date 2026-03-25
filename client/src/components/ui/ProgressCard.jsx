export default function ProgressCard({ completed, total, title }) {
  // Avoid dividing by zero if habits haven't loaded yet
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  const remaining = total - completed

  return (
    <div className="bg-surface rounded-xl p-8 flex items-center justify-between
                    shadow-sm">

      {/* Left — counts */}
      <div className="space-y-1">
        <p className="text-xs font-body font-semibold text-text-muted
                      uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-headline font-bold text-text">
            {completed}
          </span>
          <span className="text-text-muted font-body">/ {total}</span>
        </div>
      </div>

      {/* Right — progress bar */}
      <div className="flex-1 max-w-md ml-12">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-body font-medium text-primary">
            {percentage}% Progress
          </span>
          <span className="text-xs font-body font-medium text-text-muted">
            {remaining} remaining
          </span>
        </div>
        {/* Progress bar track */}
        <div className="h-2 w-full bg-progress-track rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

    </div>
  )
}