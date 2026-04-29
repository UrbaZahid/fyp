// routes/payments.js

const express  = require('express');
const router   = express.Router();
const Payment  = require('../models/Payment');
const Booking  = require('../models/booking');
const { protect, authorize } = require('../middleware/auth');

// Stripe is optional — only loaded when STRIPE_SECRET_KEY is set
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// ─── @route  POST /api/payments/create-intent ─────────────────
// @desc    Stripe payment intent banao (client secret frontend ko do)
// @access  Customer only
router.post('/create-intent', protect, authorize('customer'), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ message: 'Stripe not configured. Add STRIPE_SECRET_KEY to .env' });
    }

    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Payment is allowed for Accepted bookings
    if (booking.status !== 'Accepted') {
      return res.status(400).json({
        message: 'Payment is only allowed for accepted bookings',
      });
    }

    if (booking.isPaid) {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Amount in smallest currency unit (PKR = paisa × 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   booking.totalAmount * 100,
      currency: 'pkr',
      metadata: {
        bookingId:  bookingId,
        customerId: req.user._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount:       booking.totalAmount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/payments/confirm ───────────────────────
// @desc    Payment confirm karo — booking paid + Completed mark karo
// @access  Customer only
router.post('/confirm', protect, authorize('customer'), async (req, res) => {
  try {
    const { bookingId, stripePaymentIntentId, method } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.isPaid) {
      return res.status(400).json({ message: 'Already paid' });
    }

    // Payment record banao
    const payment = await Payment.create({
      booking:               bookingId,
      customer:              req.user._id,
      amount:                booking.totalAmount,
      method:                method || 'card',
      stripePaymentIntentId: stripePaymentIntentId || '',
      status:                'completed',
      paidAt:                new Date(),
    });

    // Booking ko paid + Completed mark karo
    booking.isPaid = true;
    booking.status = 'Completed'; // ← FIX: was missing before
    await booking.save();

    res.json({
      message: 'Payment successful! 🎉',
      payment,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  GET /api/payments/my ─────────────────────────────
// @desc    Customer ki payment history
// @access  Customer only
router.get('/my', protect, authorize('customer'), async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
