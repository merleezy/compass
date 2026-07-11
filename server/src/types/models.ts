import { Types } from 'mongoose';

// Shared compile-time shapes for our Mongoose documents. They live here (not
// inside the model files) so controllers and tests can import them without
// pulling in a model's runtime side effects (schema registration).
//
// createdAt/updatedAt exist on all three because every schema uses
// `timestamps: true`.

export interface ITask {
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IHabit {
  name: string;
  description: string;
  isActive: boolean;
  longestStreak: number;
  currentStreak: number;
  lastLoggedDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHabitLog {
  // `Types.ObjectId` is the *value* type (what the field is on a fetched
  // document); `Schema.Types.ObjectId` in the model is the *schema config*.
  habitId: Types.ObjectId;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}
