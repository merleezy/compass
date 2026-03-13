const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
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

module.exports = mongoose.model("HabitLog", habitLogSchema);
