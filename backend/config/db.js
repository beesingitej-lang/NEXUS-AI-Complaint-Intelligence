const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexus';

  try {
    // Attempt standard connection first with 1.2 second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1200,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (err) {
    console.warn(`⚠️ Could not connect to MongoDB at ${uri}: ${err.message}`);
    console.log('🔄 Initializing embedded MongoMemoryServer for standalone zero-config evaluation...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: { launchTimeout: 60000 },
      });
      const memUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Embedded MongoDB Running: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error('❌ Failed to launch embedded MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

module.exports = connectDB;
