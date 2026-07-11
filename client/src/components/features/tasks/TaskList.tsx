import { ChevronDown, ChevronRight } from 'lucide-react'
import TaskItem from './TaskItem'
import TaskFilter from './TaskFilter'
import ListCard from '../../ui/ListCard'
import type { Task, Urgency, TaskFilters } from '../../../types'

function getToday(): string {
  return new Intl.DateTimeFormat('en-CA').format(new Date())
}

const sectionLabelColor: Record<Urgency, string> = {
  overdue:   'text-error',
  today:     'text-primary',
  upcoming:  'text-amber-400',
  none:      'text-text-muted',
  completed: 'text-text-muted',
}

function SectionHeader({ label, count, urgency }: { label: string; count: number; urgency: Urgency }) {
  return (
    <div className="flex items-center gap-2 px-1 mb-2">
      <span className={`text-xs font-body font-bold uppercase tracking-widest
                        ${sectionLabelColor[urgency]}`}>
        {label}
      </span>
      <span className="text-xs font-body text-text-muted/40">{count}</span>
    </div>
  )
}

function CompletedSectionHeader({ count, isOpen, onToggle }: { count: number; isOpen: boolean; onToggle: () => void }) {
  const Icon = isOpen ? ChevronDown : ChevronRight
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-1 py-1 group
                 text-text-muted hover:text-text transition-colors"
    >
      <Icon size={14} className="shrink-0" />
      <span className="text-xs font-body font-bold uppercase tracking-widest">
        Completed
      </span>
      <span className="text-xs font-body text-text-muted/40">{count}</span>
      <span className="ml-auto text-xs font-body text-text-muted/40
                       group-hover:text-text-muted transition-colors">
        click a check to restore
      </span>
    </button>
  )
}

interface TaskListProps {
  tasks: Task[];
  pendingComplete: Set<string>;
  onToggle: (id: string, isCurrentlyCompleted: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string, dueDate: string | null, tags: string[]) => void;
  showCompleted: boolean;
  onToggleCompleted: () => void;
  onAdd: () => void;
  existingTags: string[];
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function TaskList({
  tasks, pendingComplete,
  onToggle, onDelete, onEdit,
  showCompleted, onToggleCompleted, onAdd,
  existingTags, filters, onFilterChange, onClearFilters, hasActiveFilters,
}: TaskListProps) {
  const today = getToday()

  const isEffectivelyComplete = (t: Task) => t.completed && !pendingComplete.has(t._id)

  const overdue  = tasks.filter(t => !isEffectivelyComplete(t) && t.dueDate && t.dueDate < today)
  const dueToday = tasks.filter(t => !isEffectivelyComplete(t) && t.dueDate === today)
  // Undated tasks get their own section so the grouping matches the filter's
  // "No due date" category instead of hiding inside Upcoming
  const upcoming = tasks
    .filter(t => !isEffectivelyComplete(t) && t.dueDate && t.dueDate > today)
    // The filter above guarantees dueDate is set, but .filter() can't narrow
    // the element type — hence the non-null assertions
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))
  const noDueDate = tasks.filter(t => !isEffectivelyComplete(t) && !t.dueDate)
  const completed = tasks.filter(t => isEffectivelyComplete(t))

  const hasActiveTasks = overdue.length + dueToday.length + upcoming.length + noDueDate.length > 0
  const isEmpty = !hasActiveTasks && completed.length === 0

  const actions = (
    <div className="flex items-center gap-2">
      <TaskFilter
        allTags={existingTags}
        filters={filters}
        onChange={onFilterChange}
        onClear={onClearFilters}
      />
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
          {hasActiveFilters ? (
            <>
              <p className="text-sm font-body text-text-muted">No tasks match your filters.</p>
              <button
                onClick={onClearFilters}
                className="text-xs font-body text-primary hover:text-primary-light
                           transition-colors mt-1"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-body text-text-muted">No tasks yet.</p>
              <p className="text-xs font-body text-text-muted/50 mt-1">
                Click "+ New Task" to add one.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="p-4 space-y-6">

          {overdue.length > 0 && (
            <div>
              <SectionHeader label="Overdue" count={overdue.length} urgency="overdue" />
              <div className="space-y-2">
                {overdue.map(task => (
                  <TaskItem key={task._id} task={task} urgency="overdue"
                    onToggle={onToggle} onDelete={onDelete} onEdit={onEdit}
                    existingTags={existingTags} />
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
                    onToggle={onToggle} onDelete={onDelete} onEdit={onEdit}
                    existingTags={existingTags} />
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
                    onToggle={onToggle} onDelete={onDelete} onEdit={onEdit}
                    existingTags={existingTags} />
                ))}
              </div>
            </div>
          )}

          {noDueDate.length > 0 && (
            <div>
              <SectionHeader label="No Due Date" count={noDueDate.length} urgency="none" />
              <div className="space-y-2">
                {noDueDate.map(task => (
                  <TaskItem key={task._id} task={task} urgency="none"
                    onToggle={onToggle} onDelete={onDelete} onEdit={onEdit}
                    existingTags={existingTags} />
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
                      onToggle={onToggle} onDelete={onDelete} onEdit={onEdit}
                    existingTags={existingTags} />
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
