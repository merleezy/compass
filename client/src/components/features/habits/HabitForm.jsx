import { useState } from 'react'
import { CirclePlus } from 'lucide-react'
import FormCard from '../../ui/FormCard'

export default function HabitForm({ onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function handleSubmit() {
    if (!name.trim()) return
    await onCreate(name.trim(), description.trim())
    setName('')
    setDescription('')
  }

  return (
    <FormCard
      icon={CirclePlus}
      title="New Habit"
      footer="Habit settings can be configured after creation."
    >
      <div>
        <label className="block text-xs font-body font-bold text-text-muted uppercase tracking-wider mb-2">
          Habit Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Morning Yoga"
          className="w-full bg-bg rounded-lg px-4 py-3 text-sm font-body text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="block text-xs font-body font-bold text-text-muted uppercase tracking-wider mb-2">
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
          className="w-full bg-bg rounded-lg px-4 py-3 text-sm font-body text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      <div className="pt-2">
        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-headline font-bold py-3.5 rounded-lg transition-all duration-150 shadow-[0_4px_14px_rgba(0,106,97,0.4)] hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,106,97,0.5)] active:translate-y-0"
        >
          Create Habit
        </button>
      </div>
    </FormCard>
  )
}
