// models/Provider.js

const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    // Link to User — every provider is also a User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One provider profile per user
    },

    // Which type of service they provide
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      default: null,
    },

    skills: {
      type: [String], // e.g. ["Wiring", "Fan installation", "Short circuit repair"]
      default: [],
    },

    experience: {
      type: Number, // Years of experience
      default: 0,
    },

    charges: {
      type: Number, // Per hour or per visit charge in PKR
      default: 0,
    },

    // Areas where this provider offers service
    serviceAreas: {
      type: [String], // e.g. ["Rawalpindi", "Islamabad"]
      default: [],
    },

    bio: {
      type: String,
      default: '',
    },

    // Controlled by Admin
    isApproved: {
      type: Boolean,
      default: false,
    },

    // Average rating (we can add reviews later)
    rating: {
      type: Number,
      default: 0,
    },

    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Provider', providerSchema);