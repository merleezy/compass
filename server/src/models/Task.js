const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Task', taskSchema);
