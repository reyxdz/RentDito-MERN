require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedPatterns = [
      /localhost/,
      /127\.0\.0\.1/,
      /^http:\/\/192\./,  // Any local IP
      /^http:\/\/10\./,   // Private IP range
      /duckdns\.org$/,     // DuckDNS domains
      /\.vercel\.app$/     // Vercel deployments
    ];
    
    if (allowedPatterns.some(pattern => pattern.test(origin))) {
      return callback(null, true);
    }
    
    callback(new Error('CORS not allowed'));
  },
  credentials: true
}));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/leases', require('./routes/leases'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/maintenance', require('./routes/maintenance'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve static files from React build
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// Catch-all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (0.0.0.0)`);
});
