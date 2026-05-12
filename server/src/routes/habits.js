const express = require("express");
const router = express.Router();
const {
  getHabitsToday,
  getHabits,
  createHabit,
  logHabit,
  unlogHabit,
  editHabit,
  deleteHabit,
} = require("../controllers/habitController");

router.get("/today", getHabitsToday);
router.get("/", getHabits);
router.post("/", createHabit);
router.post("/:id/log", logHabit);
router.delete("/:id/log", unlogHabit);
router.put("/:id", editHabit);
router.delete("/:id", deleteHabit);
module.exports = router;
