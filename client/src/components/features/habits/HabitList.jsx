import HabitItem from './HabitItem'
import ListCard from '../../ui/ListCard'

export default function HabitList({ habits, onToggle, onDelete, onEdit, onAdd }) {
  const actions = (
    <button
      onClick={onAdd}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                 bg-primary text-white text-xs font-headline font-bold
                 hover:bg-primary-dark transition-colors
                 shadow-[0_2px_8px_rgba(0,106,97,0.35)]"
    >
      + New Habit
    </button>
  )

  return (
    <ListCard title="Today's Focus" actions={actions}>
      {/* overflow-x-auto lets the table scroll horizontally on narrow screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-text-muted text-[11px] uppercase tracking-widest
                 font-body font-bold border-b border-white/5">
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Habit Name</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Streak</th>
              {/* Empty header for the actions column */}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {habits.map(habit => (
              <HabitItem
                key={habit._id}
                habit={habit}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </ListCard>
  )
}
