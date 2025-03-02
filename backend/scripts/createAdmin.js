/**
 * @fileoverview Admin User Creation Script
 * 
 * This utility script creates an admin user in the database.
 * It demonstrates several important backend concepts:
 * 
 * Key Concepts:
 * 1. Database Operations
 *    - MongoDB connection
 *    - Document creation
 *    - Error handling
 * 
 * 2. Environment Management
 *    - Configuration loading
 *    - Secure credentials
 *    - Path resolution
 * 
 * 3. Script Architecture
 *    - Async/await pattern
 *    - Process management
 *    - Exit handling
 * 
 * 4. Security
 *    - Role assignment
 *    - Password handling
 *    - Access control
 * 
 * Learning Points:
 * - Script organization
 * - Database interaction
 * - Error management
 * - Process control
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

/**
 * Environment Configuration
 * Load environment variables from .env file
 * Ensures secure handling of sensitive data
 */
dotenv.config({ path: '.env' });

/**
 * Admin User Creation
 * Creates a new admin user in the database
 * 
 * Features:
 * 1. Database Connection
 *    - MongoDB connection handling
 *    - Connection verification
 *    - Error management
 * 
 * 2. User Creation
 *    - Admin role assignment
 *    - Password hashing (via model)
 *    - Data validation
 * 
 * 3. Process Management
 *    - Success handling
 *    - Error handling
 *    - Clean exit
 * 
 * @async
 * @function createAdmin
 * @returns {Promise<void>}
 */
const createAdmin = async () => {
    try {
        /**
         * Database Connection
         * Establish connection to MongoDB using environment configuration
         */
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        /**
         * Admin User Creation
         * Create new user with admin privileges
         * Password will be automatically hashed by the model middleware
         */
        const adminUser = await User.create({
            username: 'admingr',
            password: 'admin123',
            role: 'admin'
        });

        // Log success information
        console.log('Admin user created successfully:');
        console.log('Username:', adminUser.username);
        console.log('Password: admin123');

        // Exit successfully
        process.exit(0);
    } catch (error) {
        /**
         * Error Handling
         * Handle any errors during admin creation:
         * - Connection failures
         * - Validation errors
         * - Duplicate users
         */
        console.error('Error:', error.message);
        process.exit(1);  // Exit with failure code
    }
};

createAdmin();
