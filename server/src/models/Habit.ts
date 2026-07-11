import mongoose, { Schema } from 'mongoose';
import type { IHabit } from '../types/models.js';

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

export default mongoose.model<IHabit>('Habit', habitSchema);
