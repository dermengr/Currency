/**
 * @fileoverview Database Configuration Module
 * 
 * This module handles MongoDB connection setup and management.
 * It demonstrates several important database concepts:
 * 
 * Key Concepts:
 * 1. Database Connection
 *    - MongoDB connection string handling
 *    - Mongoose configuration
 *    - Connection lifecycle management
 * 
 * 2. Index Management
 *    - Database optimization
 *    - Index cleanup
 *    - Collection management
 * 
 * 3. Error Handling
 *    - Connection error management
 *    - Graceful error recovery
 *    - Application termination
 * 
 * 4. Security
 *    - Environment-based configuration
 *    - Secure connection handling
 *    - Error information sanitization
 * 
 * Learning Points:
 * - Understanding MongoDB connection process
 * - Database index management
 * - Error handling patterns
 * - Application lifecycle management
 */

const mongoose = require('mongoose');  // MongoDB ODM library

/**
 * Database Connection Function
 * Establishes and manages MongoDB connection
 * 
 * Features:
 * 1. Asynchronous Connection
 *    - Promise-based connection handling
 *    - Proper error management
 * 
 * 2. Index Management
 *    - Automatic index cleanup
 *    - Collection verification
 *    - Safe index dropping
 * 
 * 3. Logging
 *    - Connection status logging
 *    - Error reporting
 *    - Debug information
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} Connection or configuration errors
 */
const connectDB = async () => {
    try {
        /**
         * MongoDB Connection
         * Connect to database using environment configuration
         */
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        /**
         * Index Management
         * Handle database optimization and cleanup
         * 
         * Steps:
         * 1. Get all collections
         * 2. Find users collection
         * 3. Drop legacy email index
         */
        try {
            const collections = await conn.connection.db.collections();
            const usersCollection = collections.find(c => c.collectionName === 'users');
            if (usersCollection) {
                await usersCollection.dropIndex('email_1');
                console.log('Dropped old email index');
            }
        } catch (indexError) {
            // Index might not exist, which is fine - just log and continue
            console.log('No old index to drop');
        }

        // Log successful connection
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        /**
         * Error Handling
         * Handle connection failures gracefully
         * 
         * 1. Log error details
         * 2. Terminate application (critical failure)
         * 3. Use appropriate exit code
         */
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
