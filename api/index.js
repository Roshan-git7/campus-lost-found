const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables if local
dotenv.config();

const app = require('../server/app');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI not configured in serverless environment.');
    return null;
  }

  try {
    const db = await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB serverless connection error:', error.message);
    return null;
  }
}

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

