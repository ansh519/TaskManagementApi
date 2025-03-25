const express = require('express');
const { z } = require('zod');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskcont');
const authenticate = require('../middleware/auth');
const router = express.Router();

// Define task validation schema using Zod
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed'], "Invalid status"),
});

// Middleware for validating task data
const validateTask = (req, res, next) => {
  try {
    req.body = taskSchema.parse(req.body); // Validate and sanitize the request body
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

// Use authentication middleware
router.use(authenticate);

// Routes with validation
router.post('/', validateTask, createTask); // Validate on task creation
router.get('/', getTasks); // No validation needed for getting tasks
router.put('/:id', validateTask, updateTask); // Validate on task update
router.delete('/:id', deleteTask); // No validation needed for deletion

module.exports = router;
