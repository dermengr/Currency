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

// Validation middleware
const currencyPairValidation = [
    check('fromCurrency')
        .trim()
        .notEmpty()
        .withMessage('Source currency is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency code must be 3 characters')
        .isUppercase()
        .withMessage('Currency code must be uppercase'),
    check('toCurrency')
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

const convertValidation = [
    check('fromCurrency')
        .trim()
        .notEmpty()
        .withMessage('Source currency is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency code must be 3 characters'),
    check('toCurrency')
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

// Public routes
router.get('/', getCurrencyPairs);
router.post('/convert', convertValidation, convertCurrency);

// Protected admin routes
router.post('/', protect, admin, currencyPairValidation, createCurrencyPair);
router.put('/:id', protect, admin, currencyPairValidation, updateCurrencyPair);
router.delete('/:id', protect, admin, deleteCurrencyPair);

module.exports = router;
