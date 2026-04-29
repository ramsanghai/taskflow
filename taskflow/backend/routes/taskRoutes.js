const express = require('express');
const router = express.Router();

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const {
  createTaskValidator,
  updateTaskValidator,
  uuidValidator,
} = require('../middleware/validators');

// All task routes require authentication
router.use(protect);

// GET /api/tasks       – list all tasks for current user
// POST /api/tasks      – create a new task
router.route('/').get(getTasks).post(createTaskValidator, createTask);

// GET /api/tasks/:id   – get single task
// PUT /api/tasks/:id   – update task
// DELETE /api/tasks/:id – delete task
router
  .route('/:id')
  .get(uuidValidator('id'), getTask)
  .put(uuidValidator('id'), updateTaskValidator, updateTask)
  .delete(uuidValidator('id'), deleteTask);

module.exports = router;
