import HabitItem from './HabitItem'
import ListCard from '../../ui/ListCard'

export default function HabitList({ habits, onToggle }) {
  return (
    <ListCard title="Today's Focus">
      {/* Habit-specific table content stays here */}
      <div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-text-muted text-[11px] uppercase tracking-widest
                 font-body font-bold border-b border-white/5">
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Habit Name</th>
              <th className="px-4 py-3 font-medium">Streak</th>
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
              />
            ))}
          </tbody>
        </table>
      </div>
    </ListCard>
  )
}
