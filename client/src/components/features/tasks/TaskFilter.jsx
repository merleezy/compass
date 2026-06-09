import { ListFilter, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { tagColor } from './tagColors'

const DUE_STATUS_OPTIONS = [
  { value: 'overdue',  label: 'Overdue' },
  { value: 'today',    label: 'Due today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'none',     label: 'No due date' },
]

function CheckboxRow({ checked, onToggle, children }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2.5 w-full px-4 py-2 text-left
                 text-sm font-body text-text-muted hover:text-text
                 hover:bg-surface-subtle transition-colors"
    >
      <span className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center
                        transition-colors
                        ${checked ? 'bg-primary border-primary' : 'border-border'}`}>
        {checked && <Check size={10} className="text-white" />}
      </span>
      {children}
    </button>
  )
}

export default function TaskFilter({ allTags, filters, onChange, onClear }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const activeCount = filters.tags.length + filters.dueStatus.length

  const toggleStatus = (status) => {
    const next = filters.dueStatus.includes(status)
      ? filters.dueStatus.filter(s => s !== status)
      : [...filters.dueStatus, status]
    onChange({ ...filters, dueStatus: next })
  }

  const toggleTag = (tag) => {
    const key = tag.toLowerCase()
    const next = filters.tags.includes(key)
      ? filters.tags.filter(t => t !== key)
      : [...filters.tags, key]
    onChange({ ...filters, tags: next })
  }

  // Union of known tags and current selections, so a selected tag whose last
  // task was deleted can still be unchecked rather than getting stuck
  const tagOptions = [...allTags]
  for (const selected of filters.tags) {
    if (!tagOptions.some(t => t.toLowerCase() === selected)) tagOptions.push(selected)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Filter tasks"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                    text-xs font-headline font-bold transition-colors
                    ${activeCount > 0
                      ? 'border-primary/50 text-primary hover:text-primary-light'
                      : 'border-border text-text-muted hover:text-text'}`}
      >
        <ListFilter size={14} className="shrink-0" />
        Filter
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full
                           bg-primary text-white text-[10px] font-body">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 z-50
                        bg-surface border border-border rounded-xl shadow-lg
                        overflow-hidden animate-fade-in">
          <p className="px-4 pt-3 pb-1 text-[10px] font-body font-bold uppercase
                        tracking-widest text-text-muted/60">
            Due date
          </p>
          {DUE_STATUS_OPTIONS.map(({ value, label }) => (
            <CheckboxRow
              key={value}
              checked={filters.dueStatus.includes(value)}
              onToggle={() => toggleStatus(value)}
            >
              {label}
            </CheckboxRow>
          ))}

          <p className="px-4 pt-3 pb-1 text-[10px] font-body font-bold uppercase
                        tracking-widest text-text-muted/60 border-t border-border mt-2">
            Tags
          </p>
          {tagOptions.length === 0 ? (
            <p className="px-4 py-2 text-sm font-body text-text-muted/50 italic">
              No tags yet
            </p>
          ) : (
            tagOptions.map(tag => (
              <CheckboxRow
                key={tag.toLowerCase()}
                checked={filters.tags.includes(tag.toLowerCase())}
                onToggle={() => toggleTag(tag)}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-current shrink-0 ${tagColor(tag).text}`} />
                <span className="truncate">{tag}</span>
              </CheckboxRow>
            ))
          )}

          {activeCount > 0 && (
            <div className="border-t border-border mt-2">
              <button
                onClick={() => { onClear(); setOpen(false) }}
                className="w-full px-4 py-2.5 text-sm font-body text-text-muted
                           hover:text-text hover:bg-surface-subtle transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
