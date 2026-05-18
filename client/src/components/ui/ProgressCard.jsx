export default function ProgressCard({ completed, total, title }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  const remaining  = total - completed
  const isComplete = percentage === 100

  const barColor   = isComplete ? 'bg-primary-light' : 'bg-primary'
  const labelColor = isComplete ? 'text-primary-light' : 'text-primary'
  const labelText  = isComplete ? 'Complete!'          : `${percentage}% Progress`

  // Glow lives on the track div (not the fill) so overflow-hidden doesn't clip it
  const trackGlow  = isComplete ? 'shadow-[0_0_10px_2px_rgba(137,245,231,0.45)]' : ''

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
          <span className={`text-xs font-body font-medium ${labelColor}`}>
            {labelText}
          </span>
          {!isComplete && (
            <span className="text-xs font-body font-medium text-text-muted">
              {remaining} remaining
            </span>
          )}
        </div>
        {/* Glow is on the track so overflow-hidden on it doesn't self-clip the shadow */}
        <div className={`h-2 w-full bg-progress-track rounded-full overflow-hidden
                         transition-shadow duration-500 ${trackGlow}`}>
          <div
            className={`h-full relative overflow-hidden rounded-full transition-all duration-500
                        ${barColor}`}
            style={{ width: `${percentage}%` }}
          >
            {isComplete && (
              <div className="animate-shimmer absolute inset-0
                              bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
