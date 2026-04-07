import { EllipsisVertical } from 'lucide-react'

export default function HabitItem({ habit, onToggle }) {
  const { _id, name, description, completedToday } = habit

  return (
    <tr className="group hover:bg-surface-subtle/40 transition-colors">

      {/* Checkbox cell */}
      <td className="px-4 py-5">
        <div
          onClick={() => onToggle(_id, completedToday)}
          className={`w-5 h-5 rounded cursor-pointer flex items-center 
                      justify-center transition-colors
                      ${completedToday
                        ? 'bg-primary'
                        : 'bg-sidebar/60 border border-border'
                      }`}
        >
          {completedToday && (
            <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
              <path
                d="M1 5l3.5 3.5L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
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
        <button className="text-text-muted hover:text-text 
                          cursor-pointer transition-colors">
          <EllipsisVertical size={18} />
        </button>
      </td>

    </tr>
  )
}