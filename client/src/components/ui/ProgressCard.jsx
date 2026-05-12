export default function ProgressCard({ completed, total, title }) {
  // Avoid dividing by zero if habits haven't loaded yet
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  const remaining = total - completed

  return (
    <div className="bg-surface rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row 
                    sm:items-center justify-between gap-6 sm:gap-0 shadow-sm">

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
      <div className="flex-1 w-full sm:ml-12">
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
            className="h-full bg-primary rounded-full transition-all duration-500
                      shadow-[0_0_12px_rgba(0,163,148,0.5)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

    </div>
  )
}