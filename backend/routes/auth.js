const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
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

    // ── Provider ke liye Provider document banao ──
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
        message: 'Provider registered! Admin approval ke baad login kar sakte hain.',
      });
    }

    // Customer — token do
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
// FIXED: Provider ko login karne do — isApproved status token ke saath bhejna
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

    // Provider ka isApproved check — lekin block mat karo, sirf status bheho
    // Frontend dashboard par warning show karega
    // NOTE: Agar aap strict blocking chahte hain toh yeh comment uncomment karo:
    // if (user.role === 'provider' && !user.isApproved) {
    //   return res.status(403).json({
    //     message: 'Your account is pending admin approval. Please wait.',
    //   });
    // }

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

module.exports = router;