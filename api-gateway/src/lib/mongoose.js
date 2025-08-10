import mongoose from 'mongoose';
import { logger } from './logger.js';

export async function connectToMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/api_gateway';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info('Mongo connected');
}