// server.js - Main entry point for the Currency Converter API
// This file sets up the Express server, configures middleware, and defines routes
// Key features:
// 1. Environment configuration
// 2. Database connection
// 3. Middleware setup (CORS, body parsing)
// 4. Route definitions
// 5. Error handling
// 6. Server initialization

const express = require('express');  // Web framework for Node.js
const cors = require('cors');        // Enable Cross-Origin Resource Sharing
const dotenv = require('dotenv');    // Load environment variables from .env file
const connectDB = require('./config/db');  // Database connection utility
const { errorHandler } = require('./utils/errorHandler');  // Global error handler

// Load environment variables from .env file
// This allows configuration of sensitive data (DB URI, JWT secret, etc.)
dotenv.config();

// Initialize database connection
// Establishes MongoDB connection using mongoose
connectDB();

// Create Express application instance
const app = express();

// Middleware Configuration
// 1. CORS - Enables cross-origin requests (needed for frontend communication)
// 2. express.json() - Parses incoming JSON payloads
// 3. urlencoded - Parses URL-encoded bodies (form data)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route Definitions
// Mount API routes at their respective endpoints
// /api/auth - Authentication routes (login, register, etc.)
// /api/currency - Currency operations (conversion, pair management)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/currency', require('./routes/currencyRoutes'));

// Global Error Handler
// Catches and formats all errors thrown in the application
app.use(errorHandler);

// 404 Handler - Catch undefined routes
// Returns standardized response for non-existent endpoints
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Server Configuration
// Use environment-defined port or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start the server
// Listen for incoming requests and log server status
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Global Promise Rejection Handler
// Catches any unhandled promise rejections and logs them
// Forces application to exit on critical errors
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process with failure code
    process.exit(1);
});
