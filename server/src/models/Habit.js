const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Habit", habitSchema);
