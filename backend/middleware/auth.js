// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect Route (must be logged in) ────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // Extract token
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, please login' });
  }

  try {
    // Verify token and extract user id from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user object to request (so any route can use req.user)
    req.user = await User.findById(decoded.id).select('-password');

    next(); // Move to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

// ─── Role Guard ────────────────────────────────────────────────
// Usage: authorize('admin') or authorize('customer', 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This route is for: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };