// routes/payments.js

const express  = require('express');
const router   = express.Router();
const stripe   = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment  = require('../models/Payment');
const Booking  = require('../models/booking');
const { protect, authorize } = require('../middleware/auth');

// ─── @route  POST /api/payments/create-intent ─────────────────
// @desc    Stripe payment intent banao (popup ke liye)
// @access  Customer only
router.post('/create-intent', protect, authorize('customer'), async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Booking check karo
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Payment is allowed for Accepted bookings (before service completion)
    if (booking.status !== 'Accepted') {
      return res.status(400).json({ 
        message: 'Payment is only allowed for accepted bookings' 
      });
    }

    // Already paid?
    if (booking.isPaid) {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Stripe payment intent banao
    // Amount cents mein hota hai Stripe mein (PKR ke liye x100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalAmount * 100,
      currency: 'pkr',
      metadata: {
        bookingId: bookingId,
        customerId: req.user._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalAmount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── @route  POST /api/payments/confirm ───────────────────────
// @desc    Payment confirm karo — booking ko paid mark karo
// @access  Customer only
router.post('/confirm', protect, authorize('customer'), async (req, res) => {
  try {
    const { bookingId, stripePaymentIntentId, method } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
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

    // Booking ko paid mark karo
    booking.isPaid = true;
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