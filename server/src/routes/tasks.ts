import express from 'express';
import {
  getTasks,
  createTask,
  editTask,
  deleteTask,
  completeTask,
  uncompleteTask,
} from '../controllers/taskController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', validateObjectId, editTask);
router.delete('/:id', validateObjectId, deleteTask);
router.patch('/:id/complete', validateObjectId, completeTask);
router.patch('/:id/uncomplete', validateObjectId, uncompleteTask);

export default router;
