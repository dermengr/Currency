/**
 * @fileoverview Authentication Controller
 * 
 * This controller manages user authentication and profile operations.
 * It demonstrates several important backend concepts:
 * 
 * Key Concepts:
 * 1. Authentication Flow
 *    - User registration
 *    - Login process
 *    - JWT token management
 * 
 * 2. Security
 *    - Password handling
 *    - Input validation
 *    - Token generation
 * 
 * 3. Database Operations
 *    - User creation
 *    - User queries
 *    - Data validation
 * 
 * 4. API Design
 *    - RESTful endpoints
 *    - Response formatting
 *    - Error handling
 * 
 * Learning Points:
 * - Authentication patterns
 * - Security best practices
 * - Controller organization
 * - Error management
 */

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

/**
 * JWT Token Generator
 * Creates a signed JWT token for user authentication
 * 
 * Features:
 * 1. Secure signing with secret key
 * 2. Token expiration
 * 3. User ID encoding
 * 
 * @param {string} id - User ID to encode
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

/**
 * User Registration Controller
 * Handles new user registration process
 * 
 * Features:
 * 1. Input Validation
 *    - Username requirements
 *    - Password strength
 *    - Duplicate checking
 * 
 * 2. Security
 *    - Password hashing (in model)
 *    - Role assignment
 *    - Token generation
 * 
 * 3. Response Handling
 *    - Success response
 *    - Validation errors
 *    - Server errors
 * 
 * @route POST /api/auth/register
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const registerUser = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both username and password'
            });
        }

        // Check username length
        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters long'
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Create user
        const user = await User.create({
            username,
            password,
            role: 'user' // Always create regular users through registration
        });

        // Generate token and send response
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
};

/**
 * User Login Controller
 * Authenticates users and provides access tokens
 * 
 * Features:
 * 1. Authentication
 *    - Username/password validation
 *    - Password comparison
 *    - Token generation
 * 
 * 2. Security
 *    - Error message sanitization
 *    - Failed attempt handling
 *    - Session management
 * 
 * 3. Response
 *    - User data
 *    - Authentication token
 *    - Error handling
 * 
 * @route POST /api/auth/login
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const loginUser = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        
        // Check user and password match
        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                },
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * User Profile Controller
 * Retrieves authenticated user's profile
 * 
 * Features:
 * 1. Authentication
 *    - Token verification (in middleware)
 *    - User identification
 * 
 * 2. Data Handling
 *    - Password exclusion
 *    - Data formatting
 *    - Not found handling
 * 
 * 3. Security
 *    - Private route protection
 *    - Data sanitization
 *    - Error handling
 * 
 * @route GET /api/auth/profile
 * @access Private
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
