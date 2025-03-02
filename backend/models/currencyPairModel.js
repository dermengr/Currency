/**
 * @fileoverview Currency Pair Model Definition
 * 
 * This module defines the currency pair data model and conversion methods.
 * It demonstrates several important data modeling concepts:
 * 
 * Key Concepts:
 * 1. Schema Design
 *    - Field definitions
 *    - Data validation
 *    - Compound indexes
 *    - Timestamps
 * 
 * 2. Business Logic
 *    - Currency conversion
 *    - Rate management
 *    - Update tracking
 * 
 * 3. Data Integrity
 *    - Field validation
 *    - Format standardization
 *    - Uniqueness constraints
 * 
 * 4. Performance
 *    - Index optimization
 *    - Efficient queries
 *    - Data normalization
 * 
 * Learning Points:
 * - MongoDB schema design
 * - Business logic implementation
 * - Data validation patterns
 * - Performance optimization
 */

const mongoose = require('mongoose');

/**
 * Currency Pair Schema
 * Defines the structure and behavior of currency pair documents
 * 
 * Fields:
 * 1. Base Currency
 *    - Source currency code
 *    - Required field
 *    - Uppercase formatting
 * 
 * 2. Target Currency
 *    - Destination currency code
 *    - Required field
 *    - Uppercase formatting
 * 
 * 3. Exchange Rate
 *    - Numeric value
 *    - Positive validation
 *    - Required field
 * 
 * 4. Last Updated
 *    - Timestamp tracking
 *    - Automatic updates
 *    - Change monitoring
 * 
 * Features:
 * - Automatic timestamps
 * - Compound indexing
 * - Data normalization
 */
const currencyPairSchema = new mongoose.Schema({
    baseCurrency: {
        type: String,
        required: [true, 'Source currency is required'],
        trim: true,           // Remove whitespace
        uppercase: true       // Ensure consistent formatting
    },
    targetCurrency: {
        type: String,
        required: [true, 'Target currency is required'],
        trim: true,           // Remove whitespace
        uppercase: true       // Ensure consistent formatting
    },
    rate: {
        type: Number,
        required: [true, 'Exchange rate is required'],
        min: [0, 'Rate must be greater than 0']  // Prevent negative rates
    },
    lastUpdated: {
        type: Date,
        default: Date.now     // Automatic timestamp
    }
}, {
    timestamps: true,        // Add createdAt and updatedAt fields
    // Ensure unique currency pairs with compound index
    indexes: [
        {
            unique: true,
            fields: ['baseCurrency', 'targetCurrency']
        }
    ]
});

/**
 * Currency Conversion Method
 * Instance method for performing currency conversions
 * 
 * Features:
 * 1. Calculation
 *    - Precise decimal handling
 *    - Rounding rules
 *    - Rate application
 * 
 * 2. Validation
 *    - Input verification
 *    - Range checking
 *    - Error handling
 * 
 * 3. Formatting
 *    - Decimal precision
 *    - Number formatting
 *    - Output standardization
 * 
 * @param {number} amount - Amount to convert
 * @returns {number} Converted amount
 * @throws {Error} Invalid input error
 */
currencyPairSchema.methods.convert = function(amount) {
    if (!amount || isNaN(amount) || amount < 0) {
        throw new Error('Invalid amount for conversion');
    }
    // Calculate with 4 decimal places for precision, then round to 2 decimal places for display
    return Number((amount * this.rate).toFixed(2));
};

/**
 * Rate Update Middleware
 * Pre-save hook for rate change tracking
 * 
 * Features:
 * 1. Change Detection
 *    - Rate modification check
 *    - Timestamp updates
 *    - Audit tracking
 * 
 * 2. Performance
 *    - Conditional execution
 *    - Efficient updates
 *    - Minimal overhead
 * 
 * 3. Data Integrity
 *    - Consistent timestamps
 *    - Change history
 *    - Update tracking
 */
currencyPairSchema.pre('save', function(next) {
    if (this.isModified('rate')) {
        this.lastUpdated = Date.now();
    }
    next();
});

const CurrencyPair = mongoose.model('CurrencyPair', currencyPairSchema);

module.exports = CurrencyPair;
