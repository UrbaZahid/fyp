// routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ─── Helper: Generate JWT Token ────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ─── @route  POST /api/auth/register ──────────────────────────
// @desc    Register a new customer or provider
// @access  Public (no login needed)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, area } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Only allow customer or provider to self-register (not admin)
    if (role === 'admin') {
      return res.status(400).json({ message: 'Cannot register as admin' });
    }

    // Create user (password gets hashed automatically by the model)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      area,
    });

    // Providers need admin approval before logging in
    if (user.role === 'provider') {
      return res.status(201).json({
        message:
          'Provider registered successfully. Please wait for admin approval before logging in.',
      });
    }

    // For customers: register and immediately return token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        area: user.area,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/auth/login ─────────────────────────────
// @desc    Login and receive JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block unapproved providers from logging in
    if (user.role === 'provider' && !user.isApproved) {
      return res.status(403).json({
        message: 'Your account is pending admin approval. Please wait.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        area: user.area,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/auth/me ──────────────────────────────────
// @desc    Get currently logged in user's info
// @access  Private (must be logged in)
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      area: req.user.area,
      isApproved: req.user.isApproved,
    },
  });
});

module.exports = router;