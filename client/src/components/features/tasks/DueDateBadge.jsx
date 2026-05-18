function getStatus(dueDate) {
  if (!dueDate) return 'none'
  const today = new Intl.DateTimeFormat('en-CA').format(new Date())
  if (dueDate < today) return 'overdue'
  if (dueDate === today) return 'today'
  return 'upcoming'
}

function formatDate(dueDate) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
    .format(new Date(dueDate + 'T00:00:00'))
}

function daysOverdue(dueDate) {
  const due = new Date(dueDate + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((today - due) / (1000 * 60 * 60 * 24))
}

export default function DueDateBadge({ dueDate }) {
  const status = getStatus(dueDate)

  if (status === 'none') {
    return <span className="text-xs font-body text-text-muted">—</span>
  }

  if (status === 'overdue') {
    const days = daysOverdue(dueDate)
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full
                       bg-error-light border border-error/30
                       text-error text-[10px] font-body font-bold uppercase tracking-wide">
        {days === 1 ? '1 day overdue' : `${days} days overdue`}
      </span>
    )
  }

  if (status === 'today') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full
                       bg-primary/20 border border-primary/30
                       text-primary-light text-[10px] font-body font-bold uppercase tracking-wide">
        Due today
      </span>
    )
  }

  // upcoming — show the formatted date
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full
                     bg-surface-subtle text-text-muted
                     text-[10px] font-body font-bold uppercase tracking-wide">
      {formatDate(dueDate)}
    </span>
  )
}
