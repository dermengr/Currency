// db.js - Database connection configuration
// This file handles the MongoDB connection setup using Mongoose
// It also includes index management for database optimization

const mongoose = require('mongoose');  // MongoDB object modeling tool

/**
 * connectDB - Establishes connection to MongoDB database
 * 
 * This function:
 * 1. Connects to MongoDB using the URI from environment variables
 * 2. Handles potential index issues by dropping problematic indexes
 * 3. Logs connection status or errors
 * 4. Terminates the application on connection failure
 * 
 * @returns {Promise<void>} - Resolves when connection is established
 */
const connectDB = async () => {
    try {
        // Establish connection to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // Index management - Drop potentially problematic index if it exists
        // This handles a specific case where an old email index might cause issues
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

        // Log successful connection with the host information
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Handle connection errors by logging and terminating the application
        console.error(`Error: ${error.message}`);
        process.exit(1);  // Exit with failure code
    }
};

module.exports = connectDB;
