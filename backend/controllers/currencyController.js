const { validationResult } = require('express-validator');
const CurrencyPair = require('../models/currencyPairModel');

// @desc    Get all currency pairs
// @route   GET /api/currency
// @access  Public
const getCurrencyPairs = async (req, res) => {
    try {
        const currencyPairs = await CurrencyPair.find().sort({ fromCurrency: 1 });
        res.json({
            success: true,
            data: currencyPairs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new currency pair
// @route   POST /api/currency
// @access  Private/Admin
const createCurrencyPair = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { fromCurrency, toCurrency, rate } = req.body;

        // Check if currency pair already exists
        const existingPair = await CurrencyPair.findOne({
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase()
        });

        if (existingPair) {
            return res.status(400).json({
                success: false,
                message: 'Currency pair already exists'
            });
        }

        // Create currency pair
        const currencyPair = await CurrencyPair.create({
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase(),
            rate
        });

        res.status(201).json({
            success: true,
            data: currencyPair
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Update currency pair
// @route   PUT /api/currency/:id
// @access  Private/Admin
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

        const currencyPair = await CurrencyPair.findById(req.params.id);

        if (!currencyPair) {
            return res.status(404).json({
                success: false,
                message: 'Currency pair not found'
            });
        }

        // Update fields
        if (req.body.rate) {
            currencyPair.rate = req.body.rate;
        }
        if (req.body.fromCurrency) {
            currencyPair.fromCurrency = req.body.fromCurrency.toUpperCase();
        }
        if (req.body.toCurrency) {
            currencyPair.toCurrency = req.body.toCurrency.toUpperCase();
        }

        const updatedPair = await currencyPair.save();

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

// @desc    Delete currency pair
// @route   DELETE /api/currency/:id
// @access  Private/Admin
const deleteCurrencyPair = async (req, res) => {
    try {
        const currencyPair = await CurrencyPair.findById(req.params.id);

        if (!currencyPair) {
            return res.status(404).json({
                success: false,
                message: 'Currency pair not found'
            });
        }

        await currencyPair.deleteOne();

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

// @desc    Convert amount between currencies
// @route   POST /api/currency/convert
// @access  Public
const convertCurrency = async (req, res) => {
    try {
        const { fromCurrency, toCurrency, amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid amount'
            });
        }

        const currencyPair = await CurrencyPair.findOne({
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase()
        });

        if (!currencyPair) {
            return res.status(404).json({
                success: false,
                message: 'Currency pair not found'
            });
        }

        const convertedAmount = currencyPair.convert(amount);

        res.json({
            success: true,
            data: {
                fromCurrency: currencyPair.fromCurrency,
                toCurrency: currencyPair.toCurrency,
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

module.exports = {
    getCurrencyPairs,
    createCurrencyPair,
    updateCurrencyPair,
    deleteCurrencyPair,
    convertCurrency
};
