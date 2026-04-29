// routes/providers.js

const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ─── @route  GET /api/providers ───────────────────────────────
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = { isApproved: true };
    if (req.query.area) {
      filter.serviceAreas = { $in: [req.query.area] };
    }
    const providers = await Provider.find(filter)
      .populate('user', 'name email phone')
      .populate('category', 'name icon');
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/providers/setup ────────────────────────
// @access  Provider only
// ⚠️ Yeh /:id se PEHLE hona chahiye
router.post('/setup', protect, authorize('provider'), async (req, res) => {
  try {
    const { category, skills, experience, charges, serviceAreas, bio } = req.body;

    const existing = await Provider.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Provider profile already exists' });
    }

    const provider = await Provider.create({
      user: req.user._id,
      category,
      skills,
      experience,
      charges,
      serviceAreas,
      bio,
    });

    res.status(201).json({ message: 'Provider profile created', provider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/providers/me/profile ────────────────────
// @access  Provider only
// ⚠️ Yeh bhi /:id se PEHLE hona chahiye
router.get('/me/profile', protect, authorize('provider'), async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id })
      .populate('category', 'name icon');

    if (!provider) {
      return res.status(404).json({ message: 'Profile not found. Please set up your profile.' });
    }

    res.json({ provider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/providers/profile ───────────────────────
// @access  Provider only
// ⚠️ Yeh bhi /:id se PEHLE hona chahiye
router.put('/profile', protect, authorize('provider'), async (req, res) => {
  try {
    const provider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json({ message: 'Profile updated', provider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/providers/:id ───────────────────────────
// @access  Public
// ⚠️ Yeh SABSE AAKHIR mein hona chahiye
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('category', 'name icon description');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({ provider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;