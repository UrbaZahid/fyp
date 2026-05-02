const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const Provider = require('../models/Provider');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ─── @route  POST /api/auth/register ──────────────────────────
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, role, phone,
      area,
      serviceAreas,
      category,
      skills,
      experience,
      charges,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (role === 'admin') {
      return res.status(400).json({ message: 'Cannot register as admin' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      area: role === 'customer' ? area : '',
    });

    if (user.role === 'provider') {
      await Provider.create({
        user:         user._id,
        serviceAreas: serviceAreas || [],
        category:     category     || null,
        skills:       skills       || [],
        experience:   experience   || 0,
        charges:      charges      || 0,
        isApproved:   false,
      });

      return res.status(201).json({
        message: 'Provider registered! You can log in after admin approval.',
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Registered successfully',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        area:  user.area,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/auth/login ─────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        area:       user.area,
        isApproved: user.isApproved,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/auth/me ──────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id:         req.user._id,
      name:       req.user.name,
      email:      req.user.email,
      role:       req.user.role,
      area:       req.user.area,
      phone:      req.user.phone,
      isApproved: req.user.isApproved,
    },
  });
});

// ─── @route  PUT /api/auth/profile ────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, area } = req.body;

    const updates = {};
    if (name)  updates.name  = name.trim();
    if (phone) updates.phone = phone.trim();
    if (area)  updates.area  = area.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, updates, { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id:    updatedUser._id,
        name:  updatedUser.name,
        email: updatedUser.email,
        role:  updatedUser.role,
        area:  updatedUser.area,
        phone: updatedUser.phone,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/auth/forgot-password/verify-email ──────
// Step 1: Check if the email exists in the database.
// No OTP or email sending — just confirms the account exists
// so the frontend can proceed to the password reset step.
router.post('/forgot-password/verify-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    // Do not reveal sensitive info — just confirm the account exists
    res.json({ message: 'Email verified. You may now reset your password.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/auth/forgot-password/reset ─────────────
// Step 2: Update the user's password directly.
// Since there is no email verification / OTP in this system,
// we accept email + newPassword and update immediately.
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    // Set new password — the pre('save') hook in User model
    // will automatically hash it before saving
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;