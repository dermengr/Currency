/**
 * @fileoverview Currency Operations Controller
 * 
 * This controller manages currency pair operations and conversions.
 * It serves as a comprehensive example of REST API implementation:
 * 
 * Key Concepts:
 * 1. RESTful Architecture
 *    - Resource-based routing
 *    - HTTP method semantics
 *    - Status code usage
 *    - Response formatting
 * 
 * 2. Database Operations
 *    - CRUD implementation
 *    - Mongoose queries
 *    - Data validation
 *    - Error handling
 * 
 * 3. Business Logic
 *    - Currency conversion
 *    - Rate management
 *    - Data normalization
 * 
 * 4. Security
 *    - Input validation
 *    - Role-based access
 *    - Error sanitization
 * 
 * 5. Best Practices
 *    - Async/await patterns
 *    - Error handling
 *    - Response consistency
 *    - Code organization
 * 
 * Learning Points:
 * - API design patterns
 * - Database interaction
 * - Error management
 * - Business logic separation
 */

const { validationResult } = require('express-validator');
const CurrencyPair = require('../models/currencyPairModel');

/**
 * Currency Pairs List Controller
 * Retrieves all available currency pairs
 * 
 * Implementation Features:
 * 1. Database Query
 *    - Mongoose find operation
 *    - Result sorting
 *    - Query optimization
 * 
 * 2. Response Handling
 *    - Success response structure
 *    - Error handling
 *    - Status codes
 * 
 * 3. Performance
 *    - Query optimization
 *    - Response formatting
 *    - Error boundaries
 * 
 * @route GET /api/currency
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
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
 * Currency Pair Creation Controller
 * Creates a new currency pair with exchange rate
 * 
 * Implementation Features:
 * 1. Input Processing
 *    - Validation with express-validator
 *    - Data normalization
 *    - Duplicate checking
 * 
 * 2. Database Operation
 *    - Document creation
 *    - Error handling
 *    - Success confirmation
 * 
 * 3. Security
 *    - Admin-only access
 *    - Input sanitization
 *    - Error handling
 * 
 * @route POST /api/currency
 * @access Private/Admin
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
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
 * Currency Pair Update Controller
 * Updates an existing currency pair's information
 * 
 * Implementation Features:
 * 1. Resource Location
 *    - ID parameter handling
 *    - Existence verification
 *    - 404 handling
 * 
 * 2. Update Process
 *    - Partial updates
 *    - Data validation
 *    - Save operation
 * 
 * 3. Response Handling
 *    - Success confirmation
 *    - Error scenarios
 *    - Status codes
 * 
 * @route PUT /api/currency/:id
 * @access Private/Admin
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
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
 * Currency Pair Deletion Controller
 * Removes a currency pair from the system
 * 
 * Implementation Features:
 * 1. Resource Verification
 *    - Existence check
 *    - Authorization check
 *    - Cascade considerations
 * 
 * 2. Deletion Process
 *    - Safe deletion
 *    - Database cleanup
 *    - Reference handling
 * 
 * 3. Response Handling
 *    - Success confirmation
 *    - Not found scenarios
 *    - Error handling
 * 
 * @route DELETE /api/currency/:id
 * @access Private/Admin
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
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
 * Currency Conversion Controller
 * Performs currency conversion calculations
 * 
 * Implementation Features:
 * 1. Input Processing
 *    - Amount validation
 *    - Currency code verification
 *    - Rate retrieval
 * 
 * 2. Business Logic
 *    - Conversion calculation
 *    - Rate application
 *    - Result formatting
 * 
 * 3. Response Handling
 *    - Detailed conversion info
 *    - Error scenarios
 *    - Rate information
 * 
 * @route POST /api/currency/convert
 * @access Public
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
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
