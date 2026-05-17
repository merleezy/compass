const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");

// Helper: returns today's date as a YYYY-MM-DD string in the given IANA
// timezone (e.g. "America/Chicago"). Falls back to UTC if absent/invalid.
// en-CA locale produces YYYY-MM-DD format natively.
const getTodayString = (tz) => {
  try {
    if (tz)
      return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(
        new Date(),
      );
  } catch (_) {
    /* invalid tz — fall through */
  }
  return new Date().toISOString().split("T")[0];
};

// Helper: subtract N days from a YYYY-MM-DD string, returns YYYY-MM-DD
const subtractDays = (dateStr, days) => {
  const d = new Date(dateStr + "T12:00:00Z"); // noon UTC avoids DST edge cases
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().split("T")[0];
};

// GET /api/habits/today
// Returns all active habits, with completedToday and currentStreak
const getHabitsToday = async (req, res) => {
  try {
    const today = getTodayString(req.query.tz);
    const yesterday = subtractDays(today, 1);

    const habits = await Habit.find({ isActive: true });

    // Fetch today's logs for completedToday flag
    const todayLogs = await HabitLog.find({ date: today });
    const completedIds = new Set(todayLogs.map((l) => l.habitId.toString()));

    const result = habits.map((habit) => {
      const id = habit._id.toString();
      const isCompletedToday = completedIds.has(id);
      let currentStreak = habit.currentStreak || 0;

      // A streak is broken if it wasn't completed today AND wasn't completed yesterday
      if (
        !isCompletedToday &&
        habit.lastLoggedDate !== yesterday &&
        habit.lastLoggedDate !== today
      ) {
        currentStreak = 0;
      }

      return {
        ...habit.toObject(),
        completedToday: isCompletedToday,
        currentStreak,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Failed to fetch habits:", err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

// GET /api/habits
// Returns all active habits
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ isActive: true });
    res.json(habits);
  } catch (err) {
    console.error("Failed to fetch habits:", err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

// POST /api/habits
// Creates a new habit
const createHabit = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Habit name is required" });
    }

    const habit = await Habit.create({ name, description });
    res.status(201).json(habit);
  } catch (err) {
    console.error("Failed to create habit:", err);
    res.status(500).json({ error: "Failed to create habit" });
  }
};

// POST /api/habits/:id/log
// Marks a habit as complete for the day; updates longestStreak if it's a new record
const logHabit = async (req, res) => {
  try {
    const today = getTodayString(req.query.tz);
    const yesterday = subtractDays(today, 1);

    const log = await HabitLog.create({ habitId: req.params.id, date: today });

    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    let currentStreak = 1;
    if (habit.lastLoggedDate === yesterday) {
      currentStreak = (habit.currentStreak || 0) + 1;
    }

    await Habit.findByIdAndUpdate(req.params.id, {
      currentStreak,
      lastLoggedDate: today,
      $max: { longestStreak: currentStreak },
    });

    res.status(201).json({ ...log.toObject(), currentStreak });
  } catch (err) {
    // Error code 11000 is MongoDB's "duplicate key" error
    // This fires when the compound index blocks a double completion
    if (err.code === 11000) {
      return res.status(409).json({ error: "Habit already logged for today" });
    }
    console.error("Failed to log habit:", err);
    res.status(500).json({ error: "Failed to log habit" });
  }
};

// DELETE /api/habits/:id/log
// Removes today's completion for a habit (undo); returns updated streak
const unlogHabit = async (req, res) => {
  try {
    const today = getTodayString(req.query.tz);
    const yesterday = subtractDays(today, 1);

    const deletedLog = await HabitLog.findOneAndDelete({
      habitId: req.params.id,
      date: today,
    });

    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    let currentStreak = habit.currentStreak || 0;

    // Only update the Habit document if we actually removed a log
    if (deletedLog) {
      currentStreak = Math.max(0, currentStreak - 1);
      let lastLoggedDate = null;

      if (currentStreak > 0) {
        lastLoggedDate = yesterday;
      } else {
        const lastLog = await HabitLog.findOne({ habitId: req.params.id }).sort(
          {
            date: -1,
          },
        );
        if (lastLog) lastLoggedDate = lastLog.date;
      }

      await Habit.findByIdAndUpdate(req.params.id, {
        currentStreak,
        lastLoggedDate,
      });
    }

    res.json({ message: "Log removed", currentStreak });
  } catch (err) {
    console.error("Failed to remove log:", err);
    res.status(500).json({ error: "Failed to remove log" });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    await HabitLog.deleteMany({ habitId: req.params.id });
    res.json({ message: "Habit deleted" });
  } catch (err) {
    console.error("Failed to delete habit:", err);
    res.status(500).json({ error: "Failed to delete habit" });
  }
};

const editHabit = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Habit name is required" });
    }

    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true },
    );
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    res.json(habit);
  } catch (err) {
    console.error("Failed to edit habit:", err);
    res.status(500).json({ error: "Failed to edit habit" });
  }
};

module.exports = {
  getHabitsToday,
  getHabits,
  createHabit,
  logHabit,
  unlogHabit,
  editHabit,
  deleteHabit,
};
