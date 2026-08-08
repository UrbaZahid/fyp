const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://fyp-woad-chi.vercel.app',
    'https://fyp-mseifehbc-urbazahids-projects.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Error: ${error.message}`);
    throw error;
  }
};

// Make sure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed'
    });
  }
});

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// ─── Test Route ───────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: 'FixIT Backend is running! 🚀' });
});

// ─── Local Development ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// ─── Vercel ───────────────────────────────────────────────────
module.exports = app;