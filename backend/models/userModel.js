/**
 * @fileoverview User Model Definition
 * 
 * This module defines the user data model and authentication methods.
 * It demonstrates several important MongoDB/Mongoose concepts:
 * 
 * Key Concepts:
 * 1. Schema Design
 *    - Field definitions
 *    - Validation rules
 *    - Indexes
 *    - Timestamps
 * 
 * 2. Security
 *    - Password hashing
 *    - Role management
 *    - Data validation
 * 
 * 3. Middleware
 *    - Pre-save hooks
 *    - Error handling
 *    - Async operations
 * 
 * 4. Methods
 *    - Instance methods
 *    - Password comparison
 *    - Authentication helpers
 * 
 * Learning Points:
 * - MongoDB schema design
 * - Password security
 * - Mongoose middleware
 * - Data validation
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Defines the structure and behavior of user documents
 * 
 * Fields:
 * 1. Username
 *    - Unique identifier
 *    - Required field
 *    - Indexed for performance
 * 
 * 2. Password
 *    - Hashed storage
 *    - Minimum length
 *    - Required field
 * 
 * 3. Role
 *    - Access control
 *    - Enumerated values
 *    - Default setting
 * 
 * Features:
 * - Automatic timestamps
 * - Index management
 * - Field validation
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,          // Ensures username uniqueness
        trim: true,           // Removes whitespace
        index: true           // Creates index for faster queries
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // Restricts role values
        default: 'user'           // Sets default role
    }
}, {
    timestamps: true,    // Adds createdAt and updatedAt fields
    autoIndex: true      // Ensures indexes are created
});

/**
 * Username Index
 * Creates a unique index for username lookups
 * 
 * Benefits:
 * 1. Query Performance
 *    - Faster username searches
 *    - Efficient sorting
 * 
 * 2. Data Integrity
 *    - Ensures uniqueness
 *    - Prevents duplicates
 *    - Database-level constraint
 */
userSchema.index({ username: 1 }, { unique: true });

/**
 * Password Hashing Middleware
 * Pre-save hook for password encryption
 * 
 * Features:
 * 1. Security
 *    - Bcrypt hashing
 *    - Salt generation
 *    - One-way encryption
 * 
 * 2. Optimization
 *    - Conditional execution
 *    - Change detection
 *    - Async processing
 * 
 * 3. Error Handling
 *    - Try-catch block
 *    - Error propagation
 *    - Middleware chain
 */
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);  // Generate salt
        this.password = await bcrypt.hash(this.password, salt);  // Hash password
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Password Verification Method
 * Instance method for password comparison
 * 
 * Features:
 * 1. Security
 *    - Secure comparison
 *    - Timing attack protection
 *    - Hash verification
 * 
 * 2. Usage
 *    - Authentication flow
 *    - Login verification
 *    - Password checks
 * 
 * 3. Error Handling
 *    - Async/await pattern
 *    - Error propagation
 *    - Type safety
 * 
 * @param {string} enteredPassword - Password to verify
 * @returns {Promise<boolean>} Verification result
 * @throws {Error} Comparison failure
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
