const mongoose = require('mongoose');

let isConnecting = false;
let mongoServer = null;

const connectDB = async () => {
    // If already connected, return
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    // If a connection attempt is already in progress, wait for it
    if (isConnecting) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (mongoose.connection.readyState >= 1) {
                    clearInterval(interval);
                    resolve(mongoose.connection);
                }
            }, 100);
        });
    }

    isConnecting = true;

    try {
        let dbUrl = process.env.MONGODB_URI;

        // If no URL or local default and we want to use memory server
        if (!dbUrl || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
            try {
                // Try to use memory server if installed and not already running
                if (!mongoServer) {
                    const { MongoMemoryServer } = require('mongodb-memory-server');
                    mongoServer = await MongoMemoryServer.create();
                    dbUrl = mongoServer.getUri();
                    console.log('🚀 Using In-Memory MongoDB');
                } else {
                    dbUrl = mongoServer.getUri();
                }
            } catch (err) {
                console.log('⚠️ mongodb-memory-server not available, falling back to local/default URI');
                dbUrl = dbUrl || 'mongodb://localhost:27017/ecolife';
            }
        }

        const conn = await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        isConnecting = false;
        return conn;
    } catch (error) {
        isConnecting = false;
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

module.exports = connectDB;
