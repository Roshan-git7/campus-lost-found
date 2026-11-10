const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes('your_password') || mongoUri.includes('cluster0.abcde')) {
      console.warn('⚠️ MONGO_URI contains placeholder credentials or is not set.');
      console.warn('👉 Update server/.env with your MongoDB Atlas connection string:');
      console.warn('   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campus_lost_found');
      return null;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash server immediately in development; allow retry or inspection
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

module.exports = connectDB;
