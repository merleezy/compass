const express = require('express');
const {
  getTasks,
  createTask,
  editTask,
  deleteTask,
  completeTask,
  uncompleteTask,
} = require('../controllers/taskController');
const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', editTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', completeTask);
router.patch('/:id/uncomplete', uncompleteTask);

module.exports = router;
