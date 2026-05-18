import { useState } from "react";
import { CirclePlus } from "lucide-react";
import FormCard from "../../ui/FormCard";

export default function TaskForm({ onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit() {
    if (!title.trim()) return;
    onCreate(title.trim(), description.trim(), dueDate || null);
    onClose();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      handleSubmit();
    }
  }

  const inputClass = `w-full bg-surface-subtle rounded-lg px-4 py-3 text-base sm:text-sm
                      font-body text-text placeholder:text-text-muted/50
                      focus:outline-none focus:ring-2 focus:ring-border`;

  return (
    <FormCard
      icon={CirclePlus}
      title="New Task"
      footer="Add a due date to unlock priority grouping."
    >
      <div>
        <label className="block text-xs font-body font-bold text-text-muted uppercase tracking-wider mb-2">
          Task Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Review pull requests"
          autoFocus
          className={inputClass}
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
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any notes..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="block text-xs font-body font-bold text-text-muted uppercase tracking-wider mb-2">
          Due Date
          <span className="normal-case tracking-normal ml-1 font-normal">
            (optional)
          </span>
        </label>
        {/* [color-scheme:dark] tells the browser to render the native date picker in dark mode */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`${inputClass} [color-scheme:dark]`}
        />
      </div>

      <div className="pt-2">
        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-headline font-bold py-3.5 rounded-lg
                     transition-all duration-150 shadow-[0_4px_14px_rgba(0,106,97,0.4)]
                     hover:bg-primary-dark hover:-translate-y-0.5
                     hover:shadow-[0_6px_20px_rgba(0,106,97,0.5)] active:translate-y-0"
        >
          Create Task
        </button>
      </div>
    </FormCard>
  );
}
