// currencyController.js - Currency pair management and conversion controller
/*
 * EDUCATIONAL NOTES FOR JUNIOR DEVELOPERS
 * 
 * This controller demonstrates important backend development concepts:
 * 1. RESTful API design with Express.js
 * 2. MongoDB operations using Mongoose
 * 3. CRUD operations implementation (Create, Read, Update, Delete)
 * 4. Input validation and error handling
 * 5. Authentication and authorization checks
 * 6. Business logic separation (currency conversion)
 * 7. Proper HTTP status code usage
 * 8. Consistent response formatting
 */

const { validationResult } = require('express-validator'); // For input validation
const CurrencyPair = require('../models/currencyPairModel'); // Mongoose model import

/**
 * Get all currency pairs
 * @route GET /api/currency
 * @access Public
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} List of all currency pairs
 * 
 * EDUCATIONAL NOTE: This demonstrates a simple READ operation with:
 * 1. Async/await for clean promise handling
 * 2. Try/catch for error handling
 * 3. MongoDB's find() and sort() operations
 * 4. Consistent response structure
 */
const getCurrencyPairs = async (req, res) => {
    try {
        // Using Mongoose to query the database and sort results
        const currencyPairs = await CurrencyPair.find().sort({ baseCurrency: 1 });
        
        // Consistent response format with success flag and data
        res.json({
            success: true,
            data: currencyPairs
        });
    } catch (error) {
        // Error handling with appropriate HTTP status code (500 for server errors)
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Create new currency pair
 * @route POST /api/currency
 * @access Private/Admin
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Created currency pair data
 * @throws {Error} If validation fails or pair already exists
 * 
 * EDUCATIONAL NOTE: This demonstrates a CREATE operation with:
 * 1. Input validation using express-validator
 * 2. Business logic for checking duplicates
 * 3. Data normalization (toUpperCase)
 * 4. Proper status codes (201 for resource creation)
 * 5. Error handling with appropriate messages
 */
const createCurrencyPair = async (req, res) => {
    try {
        // Validate request using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return 400 Bad Request for validation errors
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { baseCurrency, targetCurrency, rate } = req.body;

        // Check if currency pair already exists - business logic validation
        const existingPair = await CurrencyPair.findOne({
            baseCurrency: baseCurrency.toUpperCase(), // Data normalization
            targetCurrency: targetCurrency.toUpperCase()
        });

        if (existingPair) {
            // Return 400 Bad Request for duplicate resource
            return res.status(400).json({
                success: false,
                message: 'Currency pair already exists'
            });
        }

        // Create currency pair using Mongoose create method
        const currencyPair = await CurrencyPair.create({
            baseCurrency: baseCurrency.toUpperCase(),
            targetCurrency: targetCurrency.toUpperCase(),
            rate
        });

        // Return 201 Created for successful resource creation
        res.status(201).json({
            success: true,
            data: currencyPair
        });
    } catch (error) {
        // Generic error handling
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Update currency pair
 * @route PUT /api/currency/:id
 * @access Private/Admin
 * 
 * EDUCATIONAL NOTE: This demonstrates an UPDATE operation with:
 * 1. Route parameter usage (req.params.id)
 * 2. Conditional property updates
 * 3. Mongoose's findById and save methods
 * 4. 404 handling for resources that don't exist
 */
const updateCurrencyPair = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Find the resource by ID
        const currencyPair = await CurrencyPair.findById(req.params.id);

        // Handle 404 Not Found
        if (!currencyPair) {
            return res.status(404).json({
                success: false,
                message: 'Currency pair not found'
            });
        }

        // Conditional updates - only update fields that are provided
        if (req.body.rate) {
            currencyPair.rate = req.body.rate;
        }
        if (req.body.baseCurrency) {
            currencyPair.baseCurrency = req.body.baseCurrency.toUpperCase();
        }
        if (req.body.targetCurrency) {
            currencyPair.targetCurrency = req.body.targetCurrency.toUpperCase();
        }

        // Save the updated document
        const updatedPair = await currencyPair.save();

        // Return success response with updated data
        res.json({
            success: true,
            data: updatedPair
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Delete currency pair
 * @route DELETE /api/currency/:id
 * @access Private/Admin
 * 
 * EDUCATIONAL NOTE: This demonstrates a DELETE operation with:
 * 1. Resource existence check before deletion
 * 2. Mongoose's deleteOne method
 * 3. Appropriate success message response
 */
const deleteCurrencyPair = async (req, res) => {
    try {
        // Find the resource by ID
        const currencyPair = await CurrencyPair.findById(req.params.id);

        // Handle 404 Not Found
        if (!currencyPair) {
            return res.status(404).json({
                success: false,
                message: 'Currency pair not found'
            });
        }

        // Delete the resource
        await currencyPair.deleteOne();

        // Return success message (no data needed for deletion)
        res.json({
            success: true,
            message: 'Currency pair removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * Convert amount between currencies
 * @route POST /api/currency/convert
 * @access Public
 * 
 * EDUCATIONAL NOTE: This demonstrates business logic implementation with:
 * 1. Input validation (amount > 0)
 * 2. Resource lookup by multiple criteria
 * 3. Using model methods for business logic (convert)
 * 4. Structured response with calculated results
 */
const convertCurrency = async (req, res) => {
    try {
        const { baseCurrency, targetCurrency, amount } = req.body;

        // Validate input parameters
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid amount'
            });
        }

        // Find currency pair by compound query
        const currencyPair = await CurrencyPair.findOne({
            baseCurrency: baseCurrency.toUpperCase(),
            targetCurrency: targetCurrency.toUpperCase()
        });

        // Handle 404 Not Found
        if (!currencyPair) {
            return res.status(404).json({
                success: false,
                message: 'Currency pair not found'
            });
        }

        // Use model method to perform business logic
        const convertedAmount = currencyPair.convert(amount);

        // Return structured response with all relevant information
        res.json({
            success: true,
            data: {
                baseCurrency: currencyPair.baseCurrency,
                targetCurrency: currencyPair.targetCurrency,
                amount,
                convertedAmount,
                rate: currencyPair.rate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Export all controller functions as a module
module.exports = {
    getCurrencyPairs,
    createCurrencyPair,
    updateCurrencyPair,
    deleteCurrencyPair,
    convertCurrency
};
