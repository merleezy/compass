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
const validateObjectId = require("../middleware/validateObjectId");

router.get("/today", getHabitsToday);
router.get("/", getHabits);
router.post("/", createHabit);
router.post("/:id/log", validateObjectId, logHabit);
router.delete("/:id/log", validateObjectId, unlogHabit);
router.put("/:id", validateObjectId, editHabit);
router.delete("/:id", validateObjectId, deleteHabit);
module.exports = router;
