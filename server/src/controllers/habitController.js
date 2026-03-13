const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");

// Helper: returns today's date as a YYYY-MM-DD string
const getTodayString = () => new Date().toISOString().split("T")[0];

// GET /api/habits/today
// Returns all active habits, with a boolean indicating if it has been completed
const getHabitsToday = async (req, res) => {
  try {
    const today = getTodayString();
    const habits = await Habit.find({ isActive: true });
    const logs = await HabitLog.find({ date: today });

    // Build a set of completed habitIds for fast lookup
    const completedIds = new Set(logs.map((log) => log.habitId.toString()));

    // Attach a 'completedToday' boolean to each habit
    const result = habits.map((habit) => ({
      ...habit.toObject(),
      completedToday: completedIds.has(habit._id.toString()),
    }));

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
    const habits = await Habit.find({ isActive: today });
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
// Marks a habit as complete for the day
const logHabit = async (req, res) => {
  try {
    const today = getTodayString();
    const log = await HabitLog.create({ habitId: req.params.id, date: today });
    res.status(201).json(log);
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
// Removes today's completion for a habit (undo)
const unlogHabit = async (req, res) => {
  try {
    const today = getTodayString();
    await HabitLog.findOneAndDelete({ habitId: req.params.id, date: today });
    res.json({ message: "Log removed" });
  } catch (err) {
    console.error("Failed to remove log:", err);
    res.status(500).json({ error: "Failed to remove log" });
  }
};

module.exports = {
  getHabitsToday,
  getHabits,
  createHabit,
  logHabit,
  unlogHabit,
};
