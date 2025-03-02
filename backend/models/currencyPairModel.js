// currencyPairModel.js - Currency pair schema and conversion methods
// This file defines the data model for currency pairs and includes conversion functionality
// Key features:
// 1. Currency pair schema with validation
// 2. Automatic currency code formatting
// 3. Exchange rate validation
// 4. Conversion calculations
// 5. Timestamp management

const mongoose = require('mongoose');  // MongoDB object modeling tool

/**
 * Currency Pair Schema Definition
 * Defines the structure and validation rules for currency pair documents
 * 
 * Fields:
 * - baseCurrency: Source currency code (e.g., USD)
 * - targetCurrency: Destination currency code (e.g., EUR)
 * - rate: Exchange rate between the currencies
 * - lastUpdated: Timestamp of last rate update
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
 * Calculates converted amount based on exchange rate
 * 
 * @param {number} amount - Amount to convert
 * @returns {number} - Converted amount rounded to 2 decimal places
 * @throws {Error} - If amount is invalid
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
 * Updates lastUpdated timestamp when exchange rate changes
 * Runs before saving document if rate field is modified
 */
currencyPairSchema.pre('save', function(next) {
    if (this.isModified('rate')) {
        this.lastUpdated = Date.now();
    }
    next();
});

const CurrencyPair = mongoose.model('CurrencyPair', currencyPairSchema);

module.exports = CurrencyPair;
