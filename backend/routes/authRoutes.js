/**
 * @fileoverview Authentication Routes
 * 
 * This module defines the authentication-related routes and their validation.
 * It demonstrates several important API design concepts:
 * 
 * Key Concepts:
 * 1. Route Organization
 *    - Express Router usage
 *    - Middleware chaining
 *    - Route grouping
 * 
 * 2. Input Validation
 *    - Request validation
 *    - Data sanitization
 *    - Error messaging
 * 
 * 3. Authentication Flow
 *    - Registration process
 *    - Login handling
 *    - Profile access
 * 
 * 4. Security
 *    - Route protection
 *    - Data validation
 *    - Access control
 * 
 * Learning Points:
 * - Express routing patterns
 * - Validation implementation
 * - Middleware composition
 * - API security
 */

const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Registration Validation Rules
 * Validates user registration input
 * 
 * Rules:
 * 1. Username
 *    - Required field
 *    - Minimum length
 *    - Whitespace handling
 * 
 * 2. Password
 *    - Required field
 *    - Minimum length
 *    - Whitespace handling
 * 
 * 3. Role (optional)
 *    - Value validation
 *    - Permission check
 */
const registerValidation = [
    check('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Invalid role specified')
];

/**
 * Login Validation Rules
 * Validates user login credentials
 * 
 * Rules:
 * 1. Username
 *    - Required field
 *    - Input sanitization
 * 
 * 2. Password
 *    - Required field
 *    - Input sanitization
 */
const loginValidation = [
    check('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];

/**
 * Authentication Routes
 * Define endpoints for user authentication
 * 
 * Endpoints:
 * 1. Registration
 *    POST /api/auth/register
 *    - Creates new user account
 *    - Validates input
 *    - Returns user data and token
 * 
 * 2. Login
 *    POST /api/auth/login
 *    - Authenticates user
 *    - Validates credentials
 *    - Returns auth token
 * 
 * 3. Profile
 *    GET /api/auth/profile
 *    - Protected route
 *    - Requires auth token
 *    - Returns user data
 */
router.post('/register', registerValidation, registerUser);  // User registration
router.post('/login', loginValidation, loginUser);          // User login
router.get('/profile', protect, getUserProfile);            // Get user profile

module.exports = router;
