import { EllipsisVertical } from 'lucide-react'

export default function HabitItem({ habit, onToggle }) {
  const { _id, name, description, completedToday } = habit

  return (
    <tr className="group hover:bg-surface-subtle/40 transition-colors">

      {/* Checkbox cell */}
      <td className="px-4 py-5">
        <input
          type="checkbox"
          checked={completedToday}
          onChange={() => onToggle(_id, completedToday)}
          className="w-5 h-5 rounded accent-primary cursor-pointer"
        />
      </td>

      {/* Habit name + description */}
      <td className={`px-4 py-5 ${completedToday ? 'opacity-50' : ''}`}>
        {/* line-through: strikethrough on completed habit names */}
        <p className={`font-body font-semibold text-text
                       ${completedToday ? 'line-through' : ''}`}>
          {name}
        </p>
        {description && (
          <p className="text-xs text-text-muted font-body mt-0.5">
            {description}
          </p>
        )}
      </td>

      {/* Streak badge — static placeholder for now */}
      <td className="px-4 py-5">
        <span className="px-2.5 py-1 rounded-full bg-surface-subtle
                         text-text-muted text-[10px] font-body
                         font-bold uppercase tracking-wide">
          — Days
        </span>
      </td>

      {/* Three-dot menu — stub, no functionality yet */}
      <td className="px-4 py-5 text-right">
        <button className="text-primary hover:text-primary-dark 
                          cursor-pointer transition-colors">
          <EllipsisVertical size={18} />
        </button>
      </td>

    </tr>
  )
}