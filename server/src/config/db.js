import mongoose from 'mongoose';

export async function connectDb(uri) {
  mongoose.set('strictQuery', true);
await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
});
  return mongoose.connection;
}

export const disconnectDb = () => mongoose.disconnect();
