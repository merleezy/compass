const express = require("express");
const router = express.Router();
const {
  getHabitsToday,
  getHabits,
  createHabit,
  logHabit,
  unlogHabit,
} = require("../controllers/habitController");

router.get("/today", getHabitsToday);
router.get("/", getHabits);
router.post("/", createHabit);
router.post("/:id/log", logHabit);
router.delete("/:id/log", unlogHabit);

module.exports = router;
