// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();

// ─── Middleware ───────────────────────────────────────────────
// Allow your React frontend (localhost:3000) to call this server
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Allow the server to read JSON from request bodies
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth')); 

// ─── Test Route ───────────────────────────────────────────────
// Visit http://localhost:5000/api to confirm server is running
app.get('/', (req, res) => {
  res.json({ message: 'FixIT Backend is running! 🚀' });
});

// ─── MongoDB Connection ───────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // Stop the server if DB fails
  }
};

connectDB();

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});