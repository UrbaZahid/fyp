// models/ServiceCategory.js

const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      // e.g. "Electrician", "Plumber", "Carpenter"
    },

    description: {
      type: String,
      default: '',
    },

    icon: {
      type: String,
      default: '🔧', // emoji icon for frontend display
    },

    isActive: {
      type: Boolean,
      default: true, // Admin can deactivate a category
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);