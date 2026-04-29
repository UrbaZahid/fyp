// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['customer', 'provider', 'admin'],
      default: 'customer',
    },

    phone: {
      type: String,
      default: '',
    },

    area: {
      type: String,
      default: '',
    },

    // Only for providers — Admin must approve before they can login
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === 'customer' ? true : false;
      },
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

// ─── Hash password before saving ──────────────────────────────
// This runs automatically every time a user is saved
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Method to compare passwords at login ─────────────────────
// Usage: await user.matchPassword('plaintext') → true/false
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);