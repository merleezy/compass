import HabitItem from './HabitItem'
import { ListFilter } from 'lucide-react'

export default function HabitList({ habits, onToggle }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm overflow-hidden
                    ">

      {/* Card header */}
      <div className="px-8 py-5 flex items-center justify-between
                      bg-surface-subtle/30 ">
        <h3 className="text-lg font-headline font-bold text-text">
          Today's Focus
        </h3>
        {/* Stub filter button — no functionality yet */}
        <button className="flex items-center gap-1.5 text-sm font-body
                           font-semibold text-primary hover:opacity-75
                           transition-opacity">
          <ListFilter size={15} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-text-muted text-[11px] uppercase tracking-widest
                           font-body font-bold">
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Habit Name</th>
              <th className="px-4 py-3 font-medium">Streak</th>
              {/* Empty header for the actions column */}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="text-sm">
            {habits.map(habit => (
              <HabitItem
                key={habit._id}
                habit={habit}
                onToggle={onToggle}
              />
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}