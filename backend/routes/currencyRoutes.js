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

// Public routes
router.get('/', protect, getCurrencyPairs); // Make it protected to ensure authentication
router.post('/convert', protect, convertValidation, convertCurrency);

// Protected admin routes
router.post('/', protect, admin, currencyPairValidation, createCurrencyPair);
router.put('/:id', protect, admin, currencyPairValidation, updateCurrencyPair);
router.delete('/:id', protect, admin, deleteCurrencyPair);

module.exports = router;
