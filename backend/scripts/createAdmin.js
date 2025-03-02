const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

// Load env vars
dotenv.config({ path: '.env' });

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Create admin user
        const adminUser = await User.create({
            username: 'admingr',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin user created successfully:');
        console.log('Username:', adminUser.username);
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
