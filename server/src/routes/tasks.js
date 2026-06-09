const express = require('express');
const {
  getTasks,
  createTask,
  editTask,
  deleteTask,
  completeTask,
  uncompleteTask,
} = require('../controllers/taskController');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', validateObjectId, editTask);
router.delete('/:id', validateObjectId, deleteTask);
router.patch('/:id/complete', validateObjectId, completeTask);
router.patch('/:id/uncomplete', validateObjectId, uncompleteTask);

module.exports = router;
