/**
 * @fileoverview Currency Routes
 * 
 * This module defines the currency-related routes and their validation.
 * It demonstrates several important API design concepts:
 * 
 * Key Concepts:
 * 1. Route Organization
 *    - Public vs protected routes
 *    - Admin-only routes
 *    - Middleware composition
 * 
 * 2. Input Validation
 *    - Currency code format
 *    - Numeric validation
 *    - Custom error messages
 * 
 * 3. Access Control
 *    - Role-based access
 *    - Authentication checks
 *    - Permission levels
 * 
 * 4. API Design
 *    - RESTful endpoints
 *    - Resource management
 *    - Operation grouping
 * 
 * Learning Points:
 * - Route protection patterns
 * - Validation strategies
 * - Middleware chaining
 * - Resource organization
 */

const express = require('express');
const { check } = require('express-validator');
const { 
    getCurrencyPairs, 
    createCurrencyPair, 
    updateCurrencyPair, 
    deleteCurrencyPair,
    convertCurrency 
} = require('../controllers/currencyController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Currency Pair Validation Rules
 * Validates currency pair creation/update input
 * 
 * Rules:
 * 1. Base Currency
 *    - 3-character code
 *    - Uppercase format
 *    - Required field
 * 
 * 2. Target Currency
 *    - 3-character code
 *    - Uppercase format
 *    - Required field
 * 
 * 3. Exchange Rate
 *    - Positive number
 *    - Required field
 *    - Float validation
 */
const currencyPairValidation = [
    check('baseCurrency')
        .trim()
        .notEmpty()
        .withMessage('Source currency is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency code must be 3 characters')
        .isUppercase()
        .withMessage('Currency code must be uppercase'),
    check('targetCurrency')
        .trim()
        .notEmpty()
        .withMessage('Target currency is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency code must be 3 characters')
        .isUppercase()
        .withMessage('Currency code must be uppercase'),
    check('rate')
        .notEmpty()
        .withMessage('Exchange rate is required')
        .isFloat({ gt: 0 })
        .withMessage('Rate must be a positive number')
];

/**
 * Currency Conversion Validation Rules
 * Validates conversion request input
 * 
 * Rules:
 * 1. Currency Codes
 *    - Format validation
 *    - Required fields
 *    - Length checks
 * 
 * 2. Amount
 *    - Positive number
 *    - Required field
 *    - Float validation
 */
const convertValidation = [
    check('baseCurrency')
        .trim()
        .notEmpty()
        .withMessage('Source currency is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency code must be 3 characters'),
    check('targetCurrency')
        .trim()
        .notEmpty()
        .withMessage('Target currency is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency code must be 3 characters'),
    check('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number')
];

/**
 * Currency Routes Configuration
 * 
 * Endpoints:
 * 1. Public Routes (Authenticated)
 *    GET /api/currency
 *    - List all currency pairs
 *    - Requires authentication
 *    - Available to all users
 * 
 *    POST /api/currency/convert
 *    - Convert between currencies
 *    - Requires authentication
 *    - Input validation
 * 
 * 2. Admin Routes
 *    POST /api/currency
 *    - Create new currency pair
 *    - Admin only
 *    - Full validation
 * 
 *    PUT /api/currency/:id
 *    - Update existing pair
 *    - Admin only
 *    - Full validation
 * 
 *    DELETE /api/currency/:id
 *    - Remove currency pair
 *    - Admin only
 *    - ID validation
 */

// Authenticated user routes
router.get('/', protect, getCurrencyPairs);          // List pairs
router.post('/convert', protect, convertValidation, convertCurrency);  // Convert currency

// Admin-only routes
router.post('/', protect, admin, currencyPairValidation, createCurrencyPair);    // Create pair
router.put('/:id', protect, admin, currencyPairValidation, updateCurrencyPair);  // Update pair
router.delete('/:id', protect, admin, deleteCurrencyPair);                       // Delete pair

module.exports = router;
