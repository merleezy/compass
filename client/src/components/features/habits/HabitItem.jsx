import { EllipsisVertical, Pencil, Trash2, Check, X, Flame } from 'lucide-react'
import { useState, useRef, useEffect } from 'react';

/* ── Streak badge: 3 visual states ─────────────────────────────────────── */
function StreakBadge({ streak, completedToday }) {
  // State 1: no streak at all
  if (streak === 0) {
    return (
      <span className="px-2.5 py-1 rounded-full bg-surface-subtle
                       text-text-muted text-[10px] font-body
                       font-bold uppercase tracking-wide">
        No streak
      </span>
    );
  }

  // State 2: active streak + logged today — teal (keep it up!)
  if (completedToday) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                       bg-primary/20 border border-primary/30
                       text-primary-light text-[10px] font-body font-bold
                       uppercase tracking-wide">
        <Flame size={10} className="shrink-0" />
        {streak} {streak === 1 ? 'day' : 'days'}
      </span>
    );
  }

  // State 3: streak exists but NOT logged today — amber (at risk!)
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                     bg-amber-500/20 border border-amber-500/30
                     text-amber-400 text-[10px] font-body font-bold
                     uppercase tracking-wide">
      <Flame size={10} className="shrink-0" />
      {streak} {streak === 1 ? 'day' : 'days'}
    </span>
  );
}

export default function HabitItem({ habit, onToggle, onDelete, onEdit }) {
  const { _id, name, description, completedToday, currentStreak = 0 } = habit;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedDesc, setEditedDesc] = useState(description ?? '');

  const menuRef = useRef(null);
  const nameRef = useRef(null);

  /* Close the dropdown when clicking outside */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  /* Focus name input as soon as edit mode opens */
  useEffect(() => {
    if (isEditing && nameRef.current) nameRef.current.focus();
  }, [isEditing]);

  const startEdit = () => {
    setEditedName(name);
    setEditedDesc(description ?? '');
    setMenuOpen(false);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedName.trim()) return;
    onEdit(_id, editedName.trim(), editedDesc.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(name);
    setEditedDesc(description ?? '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') { handleCancel(); }
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(_id);
  };

  /* ── Inline editing row ─────────────────────────────────────────── */
  if (isEditing) {
    return (
      <tr className="bg-surface-subtle/60">
        {/* empty checkbox cell */}
        <td className="px-4 py-4" />

        {/* edit fields */}
        <td className="px-4 py-4" colSpan={2}>
          <div className="flex flex-col gap-2">
            <input
              ref={nameRef}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Habit name"
              className="w-full bg-sidebar border border-primary/40 rounded-lg px-3 py-1.5
                         text-text font-body text-sm outline-none
                         focus:border-primary transition-colors"
            />
            <input
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)"
              className="w-full bg-sidebar border border-border rounded-lg px-3 py-1.5
                         text-text-muted font-body text-xs outline-none
                         focus:border-primary/50 transition-colors"
            />
          </div>
        </td>

        {/* save / cancel */}
        <td className="px-4 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleSave}
              disabled={!editedName.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-primary text-white text-xs font-body font-semibold
                         hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors"
            >
              <Check size={13} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-surface-subtle border border-border text-text-muted
                         text-xs font-body hover:text-text transition-colors"
            >
              <X size={13} />
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  /* ── Normal row ─────────────────────────────────────────────────── */
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

      {/* Streak badge — hidden on xs screens to match the header */}
      <td className="px-4 py-5 hidden sm:table-cell">
        <StreakBadge streak={currentStreak} completedToday={completedToday} />
      </td>

      {/* Three-dot menu */}
      <td className="px-4 py-5 text-right">
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-text-muted hover:text-text cursor-pointer
                       transition-colors opacity-0 group-hover:opacity-100
                       focus:opacity-100"
            aria-label="Habit options"
          >
            <EllipsisVertical size={18} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 z-50 w-36 rounded-xl
                         top-full mt-1 
                         group-last:top-auto group-last:bottom-full group-last:mt-0 group-last:mb-1
                         bg-surface border border-border shadow-lg
                         overflow-hidden animate-fade-in"
            >
              <button
                onClick={startEdit}
                className="flex items-center gap-2.5 w-full px-4 py-2.5
                           text-sm font-body text-text-muted hover:text-text
                           hover:bg-surface-subtle transition-colors"
              >
                <Pencil size={14} className="shrink-0" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2.5 w-full px-4 py-2.5
                           text-sm font-body text-red-400 hover:text-red-300
                           hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} className="shrink-0" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>

    </tr>
  );
}