import TaskItem from './TaskItem'
import ListCard from '../../ui/ListCard'

function getToday() {
  return new Intl.DateTimeFormat('en-CA').format(new Date())
}

function SectionDivider({ label, count }) {
  return (
    <tr>
      <td colSpan={4} className="px-4 pt-4 pb-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-body font-bold uppercase tracking-widest text-text-muted/70">
            {label}
          </span>
          <span className="text-[10px] font-body text-text-muted/40">({count})</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>
      </td>
    </tr>
  )
}

export default function TaskList({
  tasks, pendingComplete,
  onToggle, onDelete, onEdit,
  showCompleted, onToggleCompleted, onAdd,
}) {
  const today = getToday()

  // Pending tasks are visually complete but stay in their original group
  // until the 2.5s misclick window expires
  const isEffectivelyComplete = (t) => t.completed && !pendingComplete.has(t._id)

  const overdue  = tasks.filter(t => !isEffectivelyComplete(t) && t.dueDate && t.dueDate < today)
  const dueToday = tasks.filter(t => !isEffectivelyComplete(t) && t.dueDate === today)
  const upcoming = tasks
    .filter(t => !isEffectivelyComplete(t) && (!t.dueDate || t.dueDate > today))
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  const completed = tasks.filter(t => isEffectivelyComplete(t))

  const hasActiveTasks = overdue.length + dueToday.length + upcoming.length > 0
  const isEmpty = !hasActiveTasks && completed.length === 0

  const actions = (
    <div className="flex items-center gap-3">
      {completed.length > 0 && (
        <button
          onClick={onToggleCompleted}
          className="text-xs font-body text-text-muted hover:text-text transition-colors"
        >
          {showCompleted ? 'Hide completed' : `Show completed (${completed.length})`}
        </button>
      )}
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-primary text-white text-xs font-headline font-bold
                   hover:bg-primary-dark transition-colors
                   shadow-[0_2px_8px_rgba(0,106,97,0.35)]"
      >
        + New Task
      </button>
    </div>
  )

  return (
    <ListCard title="Your Tasks" actions={actions}>
      {isEmpty ? (
        <div className="py-12 text-center">
          <p className="text-sm font-body text-text-muted">No tasks yet.</p>
          <p className="text-xs font-body text-text-muted/50 mt-1">
            Click "+ New Task" to add one.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-text-muted text-[11px] uppercase tracking-widest
                             font-body font-bold border-b border-white/5">
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Due</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">

              {overdue.length > 0 && (
                <>
                  <SectionDivider label="Overdue" count={overdue.length} />
                  {overdue.map(task => (
                    <TaskItem key={task._id} task={task}
                      onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                  ))}
                </>
              )}

              {dueToday.length > 0 && (
                <>
                  <SectionDivider label="Due Today" count={dueToday.length} />
                  {dueToday.map(task => (
                    <TaskItem key={task._id} task={task}
                      onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                  ))}
                </>
              )}

              {upcoming.length > 0 && (
                <>
                  <SectionDivider label="Upcoming" count={upcoming.length} />
                  {upcoming.map(task => (
                    <TaskItem key={task._id} task={task}
                      onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                  ))}
                </>
              )}

              {showCompleted && completed.length > 0 && (
                <>
                  <SectionDivider label="Completed" count={completed.length} />
                  {completed.map(task => (
                    <TaskItem key={task._id} task={task}
                      onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                  ))}
                </>
              )}

            </tbody>
          </table>
        </div>
      )}
    </ListCard>
  )
}
