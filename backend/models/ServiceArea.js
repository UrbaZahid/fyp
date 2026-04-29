// models/ServiceArea.js

const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Area name is required'],
      unique: true,
      trim: true,
      // e.g. "Rawalpindi", "Islamabad", "Lahore"
    },

    city: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);