import mongoose, { Schema } from 'mongoose';

interface ITask {
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

export = mongoose.model<ITask>('Task', taskSchema);
