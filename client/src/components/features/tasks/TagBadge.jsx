import { tagColor } from './tagColors'

// Pill matching DueDateBadge's sizing, but borderless by design — only
// due-date badges carry an outline. The dot inherits the text color.
export default function TagBadge({ tag }) {
  const c = tagColor(tag)

  return (
    <span
      title={tag}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  text-[10px] font-body font-bold uppercase tracking-wide
                  ${c.bg} ${c.text}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      <span className="truncate max-w-[9rem]">{tag}</span>
    </span>
  )
}
