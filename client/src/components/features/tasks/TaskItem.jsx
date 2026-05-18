import { EllipsisVertical, Pencil, Trash2, Check, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import DueDateBadge from './DueDateBadge'

const borderColor = {
  overdue:   'border-error',
  today:     'border-primary',
  upcoming:  'border-amber-400',
  completed: 'border-border',
}

const editInputClass = `w-full bg-surface-subtle border rounded-lg px-3 py-2
                        font-body text-base sm:text-sm outline-none transition-colors`

export default function TaskItem({ task, urgency, onToggle, onDelete, onEdit }) {
  const { _id, title, description, dueDate, completed } = task

  const [menuOpen, setMenuOpen]       = useState(false)
  const [isEditing, setIsEditing]     = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedDesc, setEditedDesc]   = useState(description ?? '')
  const [editedDate, setEditedDate]   = useState(dueDate ?? '')

  const menuRef  = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  useEffect(() => {
    if (isEditing && titleRef.current) titleRef.current.focus()
  }, [isEditing])

  const startEdit = () => {
    setEditedTitle(title)
    setEditedDesc(description ?? '')
    setEditedDate(dueDate ?? '')
    setMenuOpen(false)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!editedTitle.trim()) return
    onEdit(_id, editedTitle.trim(), editedDesc.trim(), editedDate || null)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTitle(title)
    setEditedDesc(description ?? '')
    setEditedDate(dueDate ?? '')
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') handleCancel()
  }

  const border = borderColor[urgency] ?? 'border-border'

  /* ── Edit mode — expands card in place ───────────────────── */
  if (isEditing) {
    return (
      <div className={`px-4 py-4 rounded-lg border-l-4 bg-surface-subtle/60 ${border}`}>
        <div className="flex flex-col gap-2">
          <input
            ref={titleRef}
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Task name"
            className={`${editInputClass} border-primary/40 text-text focus:border-primary`}
          />
          <input
            value={editedDesc}
            onChange={e => setEditedDesc(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Description (optional)"
            className={`${editInputClass} border-border text-text-muted text-base sm:text-xs focus:border-primary/50`}
          />
          <input
            type="date"
            value={editedDate}
            onChange={e => setEditedDate(e.target.value)}
            className={`${editInputClass} border-border text-text-muted text-base sm:text-xs [color-scheme:dark] focus:border-primary/50`}
          />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={!editedTitle.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-primary text-white text-xs font-body font-semibold
                       hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors"
          >
            <Check size={13} /> Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-surface-subtle border border-border text-text-muted
                       text-xs font-body hover:text-text transition-colors"
          >
            <X size={13} /> Cancel
          </button>
        </div>
      </div>
    )
  }

  /* ── Normal card view ─────────────────────────────────────── */
  return (
    <div className={`group flex items-start gap-4 px-4 py-4 rounded-lg border-l-4
                     bg-surface-subtle hover:bg-surface-raised transition-colors ${border}`}>

      {/* Circular checkbox */}
      <div
        onClick={() => onToggle(_id, completed)}
        className={`mt-0.5 w-5 h-5 rounded-full shrink-0 cursor-pointer flex items-center
                    justify-center transition-colors
                    ${completed ? 'bg-primary' : 'bg-sidebar/60 border border-border'}`}
      >
        {completed && (
          <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
            <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <p className={`font-body font-semibold text-text leading-snug
                       ${completed ? 'line-through opacity-50' : ''}`}>
          {title}
        </p>
        {description && (
          <p className={`text-xs text-text-muted font-body mt-0.5
                         ${completed ? 'opacity-50' : ''}`}>
            {description}
          </p>
        )}
        <div className="mt-2">
          <DueDateBadge dueDate={dueDate} />
        </div>
      </div>

      {/* Three-dot menu */}
      <div className="shrink-0 relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="text-text-muted hover:text-text cursor-pointer transition-colors
                     opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
          aria-label="Task options"
        >
          <EllipsisVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-50 w-36 rounded-xl top-full mt-1
                          bg-surface border border-border shadow-lg
                          overflow-hidden animate-fade-in">
            <button
              onClick={startEdit}
              className="flex items-center gap-2.5 w-full px-4 py-2.5
                         text-sm font-body text-text-muted hover:text-text
                         hover:bg-surface-subtle transition-colors"
            >
              <Pencil size={14} className="shrink-0" /> Edit
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete(_id) }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5
                         text-sm font-body text-red-400 hover:text-red-300
                         hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} className="shrink-0" /> Delete
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
