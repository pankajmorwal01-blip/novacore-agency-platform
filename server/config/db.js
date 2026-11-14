const mongoose = require('mongoose');
const config = require('./config');

let memoryServer = null;

const connectDB = async () => {
  try {
    // Attempt standard connection to specified MONGODB_URI first with a short timeout
    const options = {
      serverSelectionTimeoutMS: 2500, // fast fail if local mongod is not running
    };

    console.log(`[DB] Attempting connection to MongoDB at: ${config.MONGODB_URI}`);
    await mongoose.connect(config.MONGODB_URI, options);
    console.log('✅ [DB] Connected successfully to MongoDB:', mongoose.connection.host);
  } catch (err) {
    console.warn(`⚠️ [DB] Could not connect to primary MongoDB URI (${err.message}).`);
    console.log('🔄 [DB] Initializing embedded/in-memory MongoDB instance for local runtime...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();

      await mongoose.connect(memoryUri);
      console.log('✅ [DB] Connected successfully to embedded MongoDB instance at:', memoryUri);
    } catch (memErr) {
      console.error('❌ [DB] Fatal: Failed to initialize database:', memErr.message);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('❌ [DB] Runtime Mongoose error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [DB] Mongoose connection disconnected.');
  });
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting database:', err);
  }
};

module.exports = { connectDB, disconnectDB };

