import mongoose, { Schema } from 'mongoose';
import type { IHabitLog } from '../types/models.js';

// Passing <IHabitLog> ties the runtime schema to the compile-time type. If the
// two ever drift apart (e.g. you typo a field or give it the wrong type),
// `npm run typecheck` will flag it.
const habitLogSchema = new Schema<IHabitLog>(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },

    // Using a string instead of a date object keeps "which day" unambiguous
    // regardless of timezones, which is important for a daily tracker
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index: One log per habit per day. This prevents accidentally
// marking the same habit complete twice on the same day
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.model<IHabitLog>('HabitLog', habitLogSchema);
