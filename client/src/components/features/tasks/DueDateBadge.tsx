import type { DueStatus } from "../../../types";

function getStatus(dueDate: string): DueStatus {
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  return "upcoming";
}

function formatDate(dueDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dueDate + "T00:00:00"));
}

function daysOverdue(dueDate: string): number {
  const due = new Date(dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Dates can't be subtracted directly under TS — getTime() gives the
  // millisecond numbers the arithmetic actually happens on
  return Math.round((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DueDateBadge({ dueDate }: { dueDate: string | null | undefined }) {
  // Early return doubles as a type guard: below this line the compiler
  // knows dueDate is a string, so the helpers can require one.
  if (!dueDate) {
    return <span className="text-xs font-body text-text-muted">—</span>;
  }

  const status = getStatus(dueDate);

  if (status === "overdue") {
    const days = daysOverdue(dueDate);
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full
                       bg-error-light border border-error/30
                       text-error text-[10px] font-body font-bold uppercase tracking-wide"
      >
        {days === 1 ? "1 day overdue" : `${days} days overdue`}
      </span>
    );
  }

  if (status === "today") {
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full
                       bg-primary/20 border border-primary/30
                       text-primary-light text-[10px] font-body font-bold uppercase tracking-wide"
      >
        Due today
      </span>
    );
  }

  // upcoming — show the formatted date. No background: bg-surface-subtle
  // matched the card at rest but ghosted into view on card hover, so the
  // text sits directly on the card instead (padding kept for row alignment)
  return (
    <span
      className="inline-flex items-center py-1
                     text-text-muted
                     text-[10px] font-body font-bold uppercase tracking-wide"
    >
      {formatDate(dueDate)}
    </span>
  );
}
