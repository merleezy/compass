import mongoose, { Schema } from 'mongoose';
import type { ITask } from '../types/models.js';

// Passing <ITask> ties the runtime schema to the compile-time type: if the
// two drift apart, `npm run typecheck` flags it.
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    dueDate: {
      type: String,
      trim: true,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        default: '',
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<ITask>('Task', taskSchema);
