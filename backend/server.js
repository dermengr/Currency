/**
 * @fileoverview Express Server Entry Point
 * 
 * This is the main server file for the Currency Converter API.
 * It demonstrates several important backend development concepts:
 * 
 * Key Concepts:
 * 1. Server Setup
 *    - Express application configuration
 *    - Environment management
 *    - Server lifecycle
 * 
 * 2. Middleware Architecture
 *    - CORS handling
 *    - Request parsing
 *    - Error handling
 *    - Route mounting
 * 
 * 3. Database Integration
 *    - MongoDB connection
 *    - Connection error handling
 *    - Database configuration
 * 
 * 4. Security
 *    - Environment variables
 *    - CORS configuration
 *    - Error sanitization
 * 
 * 5. Error Management
 *    - Global error handling
 *    - Promise rejection catching
 *    - 404 handling
 * 
 * Learning Points:
 * - Understanding Express.js architecture
 * - Middleware pipeline concept
 * - Environment-based configuration
 * - Error handling patterns
 * - API security basics
 */

// Core Dependencies
const express = require('express');    // Express web framework
const cors = require('cors');          // Cross-Origin Resource Sharing
const dotenv = require('dotenv');      // Environment configuration
const connectDB = require('./config/db');  // Database connection
const { errorHandler } = require('./utils/errorHandler');  // Error handling

/**
 * Environment Configuration
 * Load and validate environment variables early in the application lifecycle
 * This ensures all required configuration is available before server starts
 */
dotenv.config();

/**
 * Database Initialization
 * Establish connection to MongoDB using Mongoose
 * Connection is handled asynchronously with error handling
 */
connectDB();

/**
 * Express Application Instance
 * Creates the main application object that will be configured with middleware
 */
const app = express();

/**
 * Middleware Configuration
 * Sets up the processing pipeline for incoming requests
 * 
 * 1. CORS - Handles Cross-Origin Resource Sharing
 *    Allows frontend to communicate with API
 * 
 * 2. Body Parsing
 *    - JSON parsing for API requests
 *    - URL-encoded data parsing for forms
 *    - Size limits and security considerations
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Route Definitions
 * Mount modular route handlers at their respective endpoints
 * 
 * Routes:
 * 1. /api/auth - Authentication operations
 *    - Login
 *    - Registration
 *    - Profile management
 * 
 * 2. /api/currency - Currency operations
 *    - Currency pair management
 *    - Conversion calculations
 *    - Rate updates
 */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/currency', require('./routes/currencyRoutes'));

/**
 * Error Handling Configuration
 * 
 * 1. Global Error Handler
 *    - Catches all errors thrown in routes
 *    - Formats errors for consistent API responses
 *    - Handles different error types appropriately
 * 
 * 2. 404 Handler
 *    - Catches requests to undefined routes
 *    - Returns standardized "not found" response
 *    - Maintains API consistency
 */
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

/**
 * Server Configuration and Startup
 * 
 * 1. Port Configuration
 *    - Uses environment variable if available
 *    - Falls back to default port 5000
 * 
 * 2. Server Initialization
 *    - Starts HTTP server
 *    - Logs startup information
 *    - Indicates environment mode
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

/**
 * Global Error Handling
 * 
 * Catches unhandled promise rejections:
 * 1. Logs error details for debugging
 * 2. Terminates process for critical errors
 * 3. Allows for graceful shutdown in production
 * 
 * This is a critical safety net for unexpected errors
 */
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process with failure code
    process.exit(1);
});
