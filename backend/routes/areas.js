// routes/areas.js

const express = require('express');
const router = express.Router();
const ServiceArea = require('../models/ServiceArea');
const { protect, authorize } = require('../middleware/auth');

// ─── @route  GET /api/areas ────────────────────────────────────
// @desc    Get all active areas
// @access  Public
router.get('/', async (req, res) => {
  try {
    const areas = await ServiceArea.find({ isActive: true });
    res.json({ areas });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/areas ───────────────────────────────────
// @desc    Add a new area
// @access  Admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, city } = req.body;

    const existing = await ServiceArea.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Area already exists' });
    }

    const area = await ServiceArea.create({ name, city });
    res.status(201).json({ message: 'Area created', area });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/areas/:id ───────────────────────────────
// @desc    Update an area (name, city, isActive)
// @access  Admin only
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, city, isActive } = req.body;

    // Check duplicate name (excluding current doc)
    if (name) {
      const existing = await ServiceArea.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'Another area with this name already exists' });
      }
    }

    const area = await ServiceArea.findByIdAndUpdate(
      req.params.id,
      { name, city, isActive },
      { new: true }
    );

    if (!area) {
      return res.status(404).json({ message: 'Area not found' });
    }

    res.json({ message: 'Area updated', area });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  DELETE /api/areas/:id ────────────────────────────
// @desc    Delete an area
// @access  Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const area = await ServiceArea.findByIdAndDelete(req.params.id);

    if (!area) {
      return res.status(404).json({ message: 'Area not found' });
    }

    res.json({ message: 'Area deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;