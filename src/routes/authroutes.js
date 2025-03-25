const express = require('express');
const { z } = require('zod');
const { register, login } = require('../controllers/authcont');
const router = express.Router();

// Define validation schemas using Zod
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Middleware for validating registration requests
const validateRegister = (req, res, next) => {
  try {
    req.body = registerSchema.parse(req.body); // Validate and sanitize the request body
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

// Middleware for validating login requests
const validateLogin = (req, res, next) => {
  try {
    req.body = loginSchema.parse(req.body); // Validate and sanitize the request body
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

// Routes with validation
router.post('/register', validateRegister, register); // Validate on registration
router.post('/login', validateLogin, login); // Validate on login

module.exports = router;
