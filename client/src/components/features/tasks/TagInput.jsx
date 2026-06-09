import { X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { tagColor } from './tagColors'

// Shared free-form chip input used by both the create modal (TaskForm) and
// the inline edit card (TaskItem, via the `compact` variant). Enter or comma
// commits a tag; suggestions come from tags already used on other tasks.
export default function TagInput({ value, onChange, suggestions = [], compact = false }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)

  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const matches = suggestions.filter(s =>
    !value.some(v => v.toLowerCase() === s.toLowerCase()) &&
    s.toLowerCase().includes(input.trim().toLowerCase())
  )

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const addTag = (raw) => {
    const tag = raw.trim()
    setInput('')
    setHighlight(-1)
    if (!tag) return
    // Case-insensitive dedupe: "Work" and "work" are the same tag
    if (value.some(v => v.toLowerCase() === tag.toLowerCase())) return
    onChange([...value, tag])
  }

  const removeTag = (tag) => onChange(value.filter(v => v !== tag))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Self-contained: never let Enter reach the form's submit-on-Enter handlers
      e.preventDefault()
      e.stopPropagation()
      if (open && highlight >= 0 && highlight < matches.length) addTag(matches[highlight])
      else addTag(input)
    } else if (e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === 'ArrowDown' && matches.length > 0) {
      e.preventDefault()
      setOpen(true)
      setHighlight(h => (h + 1) % matches.length)
    } else if (e.key === 'ArrowUp' && matches.length > 0) {
      e.preventDefault()
      setOpen(true)
      setHighlight(h => (h <= 0 ? matches.length - 1 : h - 1))
    } else if (e.key === 'Escape' && open) {
      // Only swallow Escape while our dropdown is open — otherwise let it
      // bubble so the modal / inline edit can close as usual
      e.stopPropagation()
      setOpen(false)
      setHighlight(-1)
    }
  }

  const handleBlur = () => {
    // Commit pending text so "typed a tag, clicked Create" doesn't lose it.
    // Suggestion clicks preventDefault on mousedown, so they never blur us.
    if (input.trim()) addTag(input)
    setOpen(false)
    setHighlight(-1)
  }

  const containerClass = compact
    ? `bg-surface-subtle border border-border rounded-lg px-3 py-2
       focus-within:border-primary/50 transition-colors`
    : `bg-surface-subtle rounded-lg px-4 py-3
       focus-within:ring-2 focus-within:ring-border`

  const inputClass = compact
    ? 'text-base sm:text-xs text-text-muted'
    : 'text-base sm:text-sm text-text'

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={`w-full flex flex-wrap items-center gap-1.5 cursor-text ${containerClass}`}
      >
        {value.map(tag => {
          const c = tagColor(tag)
          return (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                          text-[10px] font-body font-bold uppercase tracking-wide
                          ${c.bg} ${c.text}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              <span className="truncate max-w-[9rem]">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="shrink-0 hover:opacity-60 transition-opacity cursor-pointer"
                aria-label={`Remove tag ${tag}`}
              >
                <X size={10} />
              </button>
            </span>
          )
        })}
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); setHighlight(-1) }}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? 'Add tags...' : ''}
          className={`flex-1 min-w-24 bg-transparent outline-none font-body
                      placeholder:text-text-muted/50 ${inputClass}`}
        />
      </div>

      {open && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-40 overflow-y-auto
                        bg-surface border border-border rounded-xl shadow-lg
                        overflow-x-hidden animate-fade-in">
          {matches.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={e => { e.preventDefault(); addTag(s) }}
              onMouseEnter={() => setHighlight(i)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-left
                          text-sm font-body transition-colors
                          ${i === highlight
                            ? 'bg-surface-subtle text-text'
                            : 'text-text-muted hover:bg-surface-subtle hover:text-text'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-current shrink-0 ${tagColor(s).text}`} />
              <span className="truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
