// Shared client-side shapes for the API resources. These describe the JSON
// the server sends over the wire (so _id is a string here, not an ObjectId,
// and timestamps are ISO strings — JSON has no Date type).

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Shape returned by GET /api/habits/today — the base habit document plus the
// per-day fields the controller computes on the fly.
export interface Habit {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  longestStreak: number;
  currentStreak: number;
  lastLoggedDate: string | null;
  completedToday: boolean;
  createdAt: string;
  updatedAt: string;
}

// A union of string literals: a DueStatus can only ever be one of these four
// values, so a typo like 'overdu' fails to compile.
export type DueStatus = 'overdue' | 'today' | 'upcoming' | 'none';

// Urgency adds 'completed' for the section styling in TaskList/TaskItem.
export type Urgency = DueStatus | 'completed';

export interface TaskFilters {
  // lowercase tag names
  tags: string[];
  dueStatus: DueStatus[];
}
