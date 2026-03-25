import { useState } from 'react'
import { CirclePlus } from 'lucide-react'

export default function HabitForm({ onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function handleSubmit() {
    // Guard against empty submissions
    if (!name.trim()) return
    await onCreate(name.trim(), description.trim())
    // Reset form after successful creation
    setName('')
    setDescription('')
  }

  return (
    <section className="bg-surface-raised/60 rounded-xl p-8 shadow-sm">

      {/* Form header */}
      <div className="flex items-center gap-2 mb-6">
        <CirclePlus size={20} className="text-primary" />
        <h3 className="text-lg font-headline font-bold text-text">
          New Habit
        </h3>
      </div>

      <div className="space-y-5">

        {/* Habit name field */}
        <div>
          <label className="block text-xs font-body font-bold text-text-muted
                            uppercase tracking-wider mb-2">
            Habit Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Morning Yoga"
            className="w-full bg-bg rounded-lg
                       px-4 py-3 text-sm font-body text-text
                       placeholder:text-text-muted/50
                       focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Description field */}
        <div>
          <label className="block text-xs font-body font-bold text-text-muted
                            uppercase tracking-wider mb-2">
            Description
            <span className="normal-case tracking-normal ml-1 font-normal">
              (optional)
            </span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Define your intention..."
            rows={3}
            className="w-full bg-bg rounded-lg
                       px-4 py-3 text-sm font-body text-text
                       placeholder:text-text-muted/50
                       focus:outline-none focus:ring-2 focus:ring-primary/20
                       resize-none"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white font-headline font-bold
                      py-3.5 rounded-lg transition-all duration-150
                      shadow-[0_4px_14px_rgba(0,106,97,0.4)]
                      hover:bg-primary-dark hover:-translate-y-0.5
                      hover:shadow-[0_6px_20px_rgba(0,106,97,0.5)]
                      active:translate-y-0"
          >
            Create Habit
          </button>
          <p className="text-[10px] text-center text-text-muted mt-4
                        font-body italic">
            Habit settings can be configured after creation.
          </p>
        </div>

      </div>
    </section>
  )
}