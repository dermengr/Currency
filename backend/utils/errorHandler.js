/**
 * @fileoverview Error Handling Utility
 * 
 * This module provides centralized error handling for the application.
 * It demonstrates several important error handling concepts:
 * 
 * Key Concepts:
 * 1. Custom Error Classes
 *    - Error inheritance
 *    - Status code management
 *    - Error classification
 * 
 * 2. Middleware Pattern
 *    - Express error middleware
 *    - Error transformation
 *    - Response formatting
 * 
 * 3. MongoDB/Mongoose Errors
 *    - Cast errors (invalid IDs)
 *    - Duplicate key errors
 *    - Validation errors
 * 
 * 4. Security Considerations
 *    - Error information sanitization
 *    - Stack trace handling
 *    - Response standardization
 * 
 * Learning Points:
 * - Understanding error handling patterns
 * - Middleware implementation
 * - Database error management
 * - API error responses
 */

/**
 * Custom Error Response Class
 * Extends the built-in Error class with status code support
 * 
 * @class ErrorResponse
 * @extends Error
 * @property {string} message - Error message
 * @property {number} statusCode - HTTP status code
 */
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Error Handler Middleware
 * Processes errors and sends standardized responses
 * 
 * Features:
 * 1. Error Processing
 *    - Error object cloning
 *    - Message extraction
 *    - Stack trace logging
 * 
 * 2. Error Classification
 *    - MongoDB ObjectId errors
 *    - Duplicate key errors
 *    - Validation errors
 * 
 * 3. Response Formatting
 *    - Consistent error structure
 *    - Appropriate status codes
 *    - Success flag for client handling
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Debug logging with full stack trace
    console.error(err.stack);

    /**
     * MongoDB ObjectId Error
     * Handles invalid MongoDB ID format errors
     * Common when invalid IDs are provided in URLs
     */
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }

    /**
     * MongoDB Duplicate Key Error
     * Handles unique constraint violations
     * Common in user registration (duplicate email/username)
     */
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    /**
     * Mongoose Validation Error
     * Handles schema validation failures
     * Collects all validation messages into one response
     */
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    /**
     * Error Response
     * Sends standardized error response to client
     * Uses appropriate status code and error message
     */
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = {
    ErrorResponse,
    errorHandler
};
