const { Op } = require('sequelize');
const { Task } = require('../models');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort = 'createdAt', order = 'DESC' } = req.query;

    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const validSortFields = ['createdAt', 'updatedAt', 'due_date', 'title', 'priority'];
    const validOrders = ['ASC', 'DESC'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    const tasks = await Task.findAll({
      where,
      order: [[sortField, sortOrder]],
    });

    // Summary stats
    const stats = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };

    return res.status(200).json({
      success: true,
      data: { tasks, stats },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    const task = await Task.create({
      title,
      description: description || null,
      status: status || 'pending',
      priority: priority || 'medium',
      due_date: due_date || null,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { title, description, status, priority, due_date } = req.body;

    // Only update provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (due_date !== undefined) task.due_date = due_date;

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.destroy();

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
