const Task = require('../models/Task');

// GET /api/tasks
// Returns all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// POST /api/tasks
// Creates a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await Task.create({ title, description, dueDate, tags });
    res.status(201).json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// PATCH /api/tasks/:id
// Edits a task
const editTask = async (req, res) => {
  try {
    const { title, description, dueDate, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, tags },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (error) {
    console.error('Failed to edit task:', error);
    res.status(500).json({ error: 'Failed to edit task' });
  }
};

// DELETE /api/tasks/:id
// Deletes a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// PATCH /api/tasks/:id/complete
// Sets a task as completed
const completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (error) {
    console.error('Failed to complete task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
};

// PATCH /api/tasks/:id/uncomplete
// Uncompletes a task
const uncompleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: false },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (error) {
    console.error('Failed to uncomplete task:', error);
    res.status(500).json({ error: 'Failed to uncomplete task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  editTask,
  deleteTask,
  completeTask,
  uncompleteTask,
};
