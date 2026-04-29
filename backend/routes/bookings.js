// routes/bookings.js

const express  = require('express');
const router   = express.Router();
const Booking  = require('../models/booking');
const Provider = require('../models/Provider');
const { protect, authorize } = require('../middleware/auth');

// ─── Helper: provider dhoondo, nahi mila toh banao ─────────────
const getOrCreateProvider = async (userId) => {
  let provider = await Provider.findOne({ user: userId });
  if (!provider) {
    provider = await Provider.create({
      user:         userId,
      serviceAreas: [],
      isApproved:   false,
    });
  }
  return provider;
};

// ─── @route  POST /api/bookings ────────────────────────────────
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const {
      providerId, customerName, customerEmail, customerPhone,
      address, city, date, time, duration, notes,
    } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const booking = await Booking.create({
      customer:      req.user._id,
      provider:      providerId,
      customerName,  customerEmail, customerPhone,
      address,       city,
      date,          time,          duration,
      notes,
      totalAmount:   provider.charges,
      status:        'Pending',
    });

    res.status(201).json({
      message: 'Booking request sent! Waiting for provider approval.',
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/bookings/my ──────────────────────────────
router.get('/my', protect, authorize('customer'), async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate({
        path: 'provider',
        populate: [
          { path: 'user',     select: 'name email phone' },
          { path: 'category', select: 'name icon' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/bookings/requests ────────────────────────
// ⚠️ /:id se PEHLE hona chahiye
router.get('/requests', protect, authorize('provider'), async (req, res) => {
  try {
    const provider = await getOrCreateProvider(req.user._id);

    const bookings = await Booking.find({
      provider: provider._id,
      status:   { $in: ['Pending', 'Accepted'] },
    })
      .populate('customer', 'name email phone area')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('GET /requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/bookings/history ─────────────────────────
// ⚠️ /:id se PEHLE hona chahiye
router.get('/history', protect, authorize('provider'), async (req, res) => {
  try {
    const provider = await getOrCreateProvider(req.user._id);

    const bookings = await Booking.find({
      provider: provider._id,
      status:   { $in: ['Completed', 'Rejected'] },
    })
      .populate('customer', 'name email phone')
      .populate({
        path:     'provider',
        populate: { path: 'category', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/bookings/admin/all ───────────────────────
// ⚠️ /:id se PEHLE hona chahiye
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate({
        path:     'provider',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/bookings/:id/accept ──────────────────────
router.put('/:id/accept', protect, authorize('provider'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }
    booking.status = 'Accepted';
    await booking.save();
    res.json({ message: 'Booking accepted!', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/bookings/:id/reject ──────────────────────
router.put('/:id/reject', protect, authorize('provider'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: `Cannot reject — booking is ${booking.status}` });
    }
    booking.status = 'Rejected';
    await booking.save();
    res.json({ message: 'Booking rejected', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/bookings/:id/complete ────────────────────
router.put('/:id/complete', protect, authorize('provider'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Accepted') {
      return res.status(400).json({ message: 'Only accepted bookings can be marked complete' });
    }
    booking.status = 'Completed';
    await booking.save();
    res.json({ message: 'Job marked as completed!', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  PUT /api/bookings/:id/cancel ──────────────────────
router.put('/:id/cancel', protect, authorize('customer'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!['Pending', 'Accepted'].includes(booking.status)) {
      return res.status(400).json({ message: 'This booking cannot be cancelled' });
    }
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = 'Rejected';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;