import mongoose from 'mongoose';
import { config } from './env.js';
import { seedDatabase } from '../utils/seed.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.log(`ℹ️ MongoDB Offline (${error.message}). Running with in-memory fallback store.`);
  }
};


