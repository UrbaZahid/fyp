// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
   origin:
   [
    'http://localhost:3000',
    'fyp-woad-chi.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));  
app.use('/api/areas',      require('./routes/areas'));       
app.use('/api/providers',  require('./routes/providers'));   
app.use('/api/bookings',   require('./routes/bookings')); 
app.use('/api/payments',   require('./routes/payments'));   
app.use('/api/admin',      require('./routes/admin'));  

// ─── Test Route ───────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: 'FixIT Backend is running! 🚀' });
});

// ─── MongoDB Connection ───────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});