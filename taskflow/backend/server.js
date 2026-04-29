require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import models to register associations
require('./models/index');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ──────────────────────────────────────────────
// MIDDLEWARE
// ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ──────────────────────────────────────────────
// ROUTES
// ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ──────────────────────────────────────────────
// ERROR HANDLING
// ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ──────────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 TaskFlow API running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
