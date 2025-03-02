const mongoose = require('mongoose');

const currencyPairSchema = new mongoose.Schema({
    baseCurrency: {
        type: String,
        required: [true, 'Source currency is required'],
        trim: true,
        uppercase: true
    },
    targetCurrency: {
        type: String,
        required: [true, 'Target currency is required'],
        trim: true,
        uppercase: true
    },
    rate: {
        type: Number,
        required: [true, 'Exchange rate is required'],
        min: [0, 'Rate must be greater than 0']
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    // Add compound index to ensure unique currency pairs
    indexes: [
        {
            unique: true,
            fields: ['baseCurrency', 'targetCurrency']
        }
    ]
});

// Add a method to convert amount
currencyPairSchema.methods.convert = function(amount) {
    if (!amount || isNaN(amount) || amount < 0) {
        throw new Error('Invalid amount for conversion');
    }
    // Calculate with 4 decimal places for precision, then round to 2 decimal places for display
    return Number((amount * this.rate).toFixed(2));
};

// Middleware to update lastUpdated timestamp when rate is modified
currencyPairSchema.pre('save', function(next) {
    if (this.isModified('rate')) {
        this.lastUpdated = Date.now();
    }
    next();
});

const CurrencyPair = mongoose.model('CurrencyPair', currencyPairSchema);

module.exports = CurrencyPair;
