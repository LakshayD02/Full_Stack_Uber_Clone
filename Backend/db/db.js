const mongoose = require('mongoose');

let isConnected = false;

async function connectToDb() {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI environment variable is missing');
        return;
    }

    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

module.exports = connectToDb;