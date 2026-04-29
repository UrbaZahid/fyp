// models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // Kis booking ka payment hai
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },

    // Kaun pay kar raha hai
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Kitna pay hua
    amount: {
      type: Number,
      required: true,
    },

    // Payment method
    method: {
      type: String,
      enum: ['card', 'mobile_wallet', 'net_banking'],
      default: 'card',
    },

    // Stripe ka payment intent ID (tracking ke liye)
    stripePaymentIntentId: {
      type: String,
      default: '',
    },

    // Payment ka status
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);