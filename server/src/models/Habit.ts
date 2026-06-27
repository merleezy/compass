import mongoose, { Schema } from 'mongoose';

interface IHabit {
  name: string;
  description: string;
  isActive: boolean;
  longestStreak: number;
  currentStreak: number;
  lastLoggedDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    lastLoggedDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export = mongoose.model<IHabit>('Habit', habitSchema);
