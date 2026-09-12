import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('');
    console.warn('[LifeQuest] MONGODB_URI is missing. Copy server/.env.example to server/.env and paste your MongoDB Atlas connection string.');
    console.warn('');
    return null;
  }
  const conn = await mongoose.connect(uri);
  console.log(`[LifeQuest] MongoDB connected — ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}