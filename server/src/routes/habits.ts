import express from 'express';
import {
  getHabitsToday,
  getHabits,
  createHabit,
  logHabit,
  unlogHabit,
  editHabit,
  deleteHabit,
} from '../controllers/habitController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/today', getHabitsToday);
router.get('/', getHabits);
router.post('/', createHabit);
router.post('/:id/log', validateObjectId, logHabit);
router.delete('/:id/log', validateObjectId, unlogHabit);
router.put('/:id', validateObjectId, editHabit);
router.delete('/:id', validateObjectId, deleteHabit);

export default router;
