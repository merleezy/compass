import { ChevronDown, ChevronRight } from 'lucide-react'
import TaskItem from './TaskItem'
import ListCard from '../../ui/ListCard'

function getToday() {
  return new Intl.DateTimeFormat('en-CA').format(new Date())
}

const sectionLabelColor = {
  overdue:   'text-error',
  today:     'text-primary',
  upcoming:  'text-amber-400',
  completed: 'text-text-muted',
}

function SectionHeader({ label, count, urgency }) {
  return (
    <div className="flex items-center gap-2 px-1 mb-2">
      <span className={`text-[10px] font-body font-bold uppercase tracking-widest
                        ${sectionLabelColor[urgency]}`}>
        {label}
      </span>
      <span className="text-[10px] font-body text-text-muted/40">{count}</span>
    </div>
  )
}

function CompletedSectionHeader({ count, isOpen, onToggle }) {
  const Icon = isOpen ? ChevronDown : ChevronRight
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-1 py-1 group
                 text-text-muted hover:text-text transition-colors"
    >
      <Icon size={12} className="shrink-0" />
      <span className="text-[10px] font-body font-bold uppercase tracking-widest">
        Completed
      </span>
      <span className="text-[10px] font-body text-text-muted/40">{count}</span>
      <span className="ml-auto text-[10px] font-body text-text-muted/40
                       group-hover:text-text-muted transition-colors">
        click a check to restore
      </span>
    </button>
  )
}

export default function TaskList({
  tasks, pendingComplete,
  onToggle, onDelete, onEdit,
  showCompleted, onToggleCompleted, onAdd,
}) {
  const today = getToday()

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
    <button
      onClick={onAdd}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                 bg-primary text-white text-xs font-headline font-bold
                 hover:bg-primary-dark transition-colors
                 shadow-[0_2px_8px_rgba(0,106,97,0.35)]"
    >
      + New Task
    </button>
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
        <div className="p-4 space-y-6">

          {overdue.length > 0 && (
            <div>
              <SectionHeader label="Overdue" count={overdue.length} urgency="overdue" />
              <div className="space-y-2">
                {overdue.map(task => (
                  <TaskItem key={task._id} task={task} urgency="overdue"
                    onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                ))}
              </div>
            </div>
          )}

          {dueToday.length > 0 && (
            <div>
              <SectionHeader label="Due Today" count={dueToday.length} urgency="today" />
              <div className="space-y-2">
                {dueToday.map(task => (
                  <TaskItem key={task._id} task={task} urgency="today"
                    onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                ))}
              </div>
            </div>
          )}

          {upcoming.length > 0 && (
            <div>
              <SectionHeader label="Upcoming" count={upcoming.length} urgency="upcoming" />
              <div className="space-y-2">
                {upcoming.map(task => (
                  <TaskItem key={task._id} task={task} urgency="upcoming"
                    onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="border-t border-border pt-4">
              <CompletedSectionHeader
                count={completed.length}
                isOpen={showCompleted}
                onToggle={onToggleCompleted}
              />
              {showCompleted && (
                <div className="space-y-2 mt-3">
                  {completed.map(task => (
                    <TaskItem key={task._id} task={task} urgency="completed"
                      onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </ListCard>
  )
}
