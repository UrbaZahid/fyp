// routes/categories.js

const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/ServiceCategory');
const { protect, authorize } = require('../middleware/auth');

// ─── @route  GET /api/categories ──────────────────────────────
// @desc    Get all active categories
// @access  Public (Hero page pe dikhani hain without login)
router.get('/', async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/categories ─────────────────────────────
// @desc    Add a new category
// @access  Admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const existing = await ServiceCategory.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await ServiceCategory.create({ name, description, icon });
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/categories/:id ──────────────────────────
// @desc    Update a category
// @access  Admin only
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  DELETE /api/categories/:id ───────────────────────
// @desc    Delete a category
// @access  Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;