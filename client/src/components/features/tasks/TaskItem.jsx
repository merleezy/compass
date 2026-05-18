import { EllipsisVertical, Pencil, Trash2, Check, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import DueDateBadge from './DueDateBadge'

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
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

  const handleDelete = () => { setMenuOpen(false); onDelete(_id) }

  const editInputClass = `w-full bg-sidebar border rounded-lg px-3 py-1.5
                          font-body text-sm outline-none transition-colors`

  /* ── Inline editing row ───────────────────────────────────── */
  if (isEditing) {
    return (
      <tr className="bg-surface-subtle/60">
        <td className="px-4 py-4" />
        <td className="px-4 py-4">
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
              className={`${editInputClass} border-border text-text-muted text-xs focus:border-primary/50`}
            />
            <input
              type="date"
              value={editedDate}
              onChange={e => setEditedDate(e.target.value)}
              className={`${editInputClass} border-border text-text-muted text-xs [color-scheme:dark] focus:border-primary/50`}
            />
          </div>
        </td>
        <td className="hidden sm:table-cell" />
        <td className="px-4 py-4 text-right">
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
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
        </td>
      </tr>
    )
  }

  /* ── Normal row ───────────────────────────────────────────── */
  return (
    <tr className="group hover:bg-surface-subtle/40 transition-colors">

      {/* Checkbox */}
      <td className="px-4 py-5">
        <div
          onClick={() => onToggle(_id, completed)}
          className={`w-5 h-5 rounded cursor-pointer flex items-center
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
      </td>

      {/* Title + description + mobile badge */}
      <td className="px-4 py-5">
        <p className={`font-body font-semibold text-text
                       ${completed ? 'line-through opacity-50' : ''}`}>
          {title}
        </p>
        {description && (
          <p className={`text-xs text-text-muted font-body mt-0.5
                         ${completed ? 'opacity-50' : ''}`}>
            {description}
          </p>
        )}
        <div className="mt-2 sm:hidden inline-block">
          <DueDateBadge dueDate={dueDate} />
        </div>
      </td>

      {/* Due date badge — desktop only */}
      <td className="px-4 py-5 hidden sm:table-cell">
        <DueDateBadge dueDate={dueDate} />
      </td>

      {/* Three-dot menu */}
      <td className="px-4 py-5 text-right">
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="text-text-muted hover:text-text cursor-pointer transition-colors
                       opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            aria-label="Task options"
          >
            <EllipsisVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 w-36 rounded-xl
                            top-full mt-1
                            group-last:top-auto group-last:bottom-full group-last:mt-0 group-last:mb-1
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
                onClick={handleDelete}
                className="flex items-center gap-2.5 w-full px-4 py-2.5
                           text-sm font-body text-red-400 hover:text-red-300
                           hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} className="shrink-0" /> Delete
              </button>
            </div>
          )}
        </div>
      </td>

    </tr>
  )
}
