// userModel.js - User schema and authentication methods
// This file defines the user data model and includes password hashing functionality
// Key features:
// 1. User schema definition with validation
// 2. Password hashing middleware
// 3. Password comparison method
// 4. Role-based access control

const mongoose = require('mongoose');  // MongoDB object modeling tool
const bcrypt = require('bcryptjs');    // Password hashing utility

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents
 * 
 * Fields:
 * - username: Unique identifier for the user
 * - password: Hashed password string
 * - role: User access level (user/admin)
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

// Create unique index on username field
// This provides an additional layer of uniqueness constraint
userSchema.index({ username: 1 }, { unique: true });

/**
 * Password Hashing Middleware
 * Automatically hashes password before saving to database
 * Only runs if password field has been modified
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
 * Password Comparison Method
 * Verifies if provided password matches stored hash
 * Used during user authentication
 * 
 * @param {string} enteredPassword - The password to verify
 * @returns {Promise<boolean>} - True if password matches
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
