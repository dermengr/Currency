const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // Drop the problematic index if it exists
        try {
            const collections = await conn.connection.db.collections();
            const usersCollection = collections.find(c => c.collectionName === 'users');
            if (usersCollection) {
                await usersCollection.dropIndex('email_1');
                console.log('Dropped old email index');
            }
        } catch (indexError) {
            // Index might not exist, which is fine
            console.log('No old index to drop');
        }

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
