const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");

// Helper: returns today's date as a YYYY-MM-DD string in the given IANA
// timezone (e.g. "America/Chicago"). Falls back to UTC if absent/invalid.
// en-CA locale produces YYYY-MM-DD format natively.
const getTodayString = (tz) => {
  try {
    if (tz) return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
  } catch (_) { /* invalid tz — fall through */ }
  return new Date().toISOString().split("T")[0];
};

// Helper: subtract N days from a YYYY-MM-DD string, returns YYYY-MM-DD
const subtractDays = (dateStr, days) => {
  const d = new Date(dateStr + "T12:00:00Z"); // noon UTC avoids DST edge cases
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().split("T")[0];
};

// Helper: given an array of YYYY-MM-DD date strings and today's date,
// walk backwards from today (or yesterday if not completed today) and
// count consecutive logged days.
const computeStreakFromDates = (dates, today) => {
  if (!dates || dates.length === 0) return 0;

  const dateSet = new Set(dates);

  const prevDay = (dateStr) => {
    const d = new Date(dateStr + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().split("T")[0];
  };

  // If completed today start counting from today, otherwise from yesterday
  let current = dateSet.has(today) ? today : prevDay(today);
  let streak = 0;

  while (dateSet.has(current)) {
    streak++;
    current = prevDay(current);
  }

  return streak;
};

// GET /api/habits/today
// Returns all active habits, with completedToday and currentStreak
const getHabitsToday = async (req, res) => {
  try {
    const today = getTodayString(req.query.tz);
    // TODO: 90-day rolling window — any streak longer than 90 days will be
    // incorrectly reported as 0 since older logs are excluded from the query.
    // Fix: persist currentStreak on the Habit document (like longestStreak)
    // and update it on each log/unlog, removing the need for a window entirely.
    const startDate = subtractDays(today, 90);

    const habits = await Habit.find({ isActive: true });

    // Fetch today's logs for completedToday flag
    const todayLogs = await HabitLog.find({ date: today });
    const completedIds = new Set(todayLogs.map((l) => l.habitId.toString()));

    // Batch-fetch all logs in the last 90 days — one DB round trip for all habits
    const recentLogs = await HabitLog.find({ date: { $gte: startDate } });

    // Group log dates by habitId for fast lookup
    const logsByHabit = {};
    for (const log of recentLogs) {
      const id = log.habitId.toString();
      if (!logsByHabit[id]) logsByHabit[id] = [];
      logsByHabit[id].push(log.date);
    }

    const result = habits.map((habit) => {
      const id = habit._id.toString();
      const dates = logsByHabit[id] || [];
      const currentStreak = computeStreakFromDates(dates, today);
      return {
        ...habit.toObject(),
        completedToday: completedIds.has(id),
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
    const log = await HabitLog.create({ habitId: req.params.id, date: today });

    // Compute new current streak to check against longestStreak
    // TODO: same 90-day window limitation as getHabitsToday (see above)
    const startDate = subtractDays(today, 90);
    const recentLogs = await HabitLog.find({
      habitId: req.params.id,
      date: { $gte: startDate },
    });
    const currentStreak = computeStreakFromDates(
      recentLogs.map((l) => l.date),
      today
    );

    // $max only writes if currentStreak > longestStreak — safe to always run
    await Habit.findByIdAndUpdate(req.params.id, {
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
    await HabitLog.findOneAndDelete({ habitId: req.params.id, date: today });

    // Recompute streak from the remaining logs (today is now gone)
    // TODO: same 90-day window limitation as getHabitsToday (see above)
    const startDate = subtractDays(today, 90);
    const recentLogs = await HabitLog.find({
      habitId: req.params.id,
      date: { $gte: startDate },
    });
    const currentStreak = computeStreakFromDates(
      recentLogs.map((l) => l.date),
      today
    );

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
      { new: true }
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
