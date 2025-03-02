/**
 * @fileoverview Authentication Middleware
 * 
 * This module provides authentication and authorization middleware.
 * It demonstrates several important security concepts:
 * 
 * Key Concepts:
 * 1. JWT Authentication
 *    - Token verification
 *    - User identification
 *    - Session management
 * 
 * 2. Authorization
 *    - Role-based access
 *    - Route protection
 *    - Permission checking
 * 
 * 3. Security
 *    - Token extraction
 *    - Error handling
 *    - User validation
 * 
 * 4. Middleware Pattern
 *    - Request processing
 *    - Response handling
 *    - Next function usage
 * 
 * Learning Points:
 * - JWT implementation
 * - Middleware architecture
 * - Security best practices
 * - Error management
 */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Route Protection Middleware
 * Verifies JWT tokens and authenticates users
 * 
 * Features:
 * 1. Token Processing
 *    - Header extraction
 *    - Bearer scheme handling
 *    - Token validation
 * 
 * 2. User Authentication
 *    - Token decoding
 *    - User lookup
 *    - Session validation
 * 
 * 3. Security
 *    - Error boundaries
 *    - Password exclusion
 *    - Token verification
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware
 */
const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = { protect };

/**
 * Admin Authorization Middleware
 * Verifies user has admin privileges
 * 
 * Features:
 * 1. Role Verification
 *    - Admin role check
 *    - Permission validation
 *    - Access control
 * 
 * 2. Security
 *    - Role-based auth
 *    - Unauthorized handling
 *    - Error responses
 * 
 * 3. Flow Control
 *    - Middleware chaining
 *    - Request filtering
 *    - Response handling
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as an admin'
        });
    }
};

module.exports = { protect, admin };
