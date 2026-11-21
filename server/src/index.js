import { env } from './config/env.js';
import { connectDb, disconnectDb } from './config/db.js';
import { createApp } from './app.js';

if (!env.mongoUri) {
  console.error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

if (!env.jwtSecret || env.jwtSecret.length < 32) {
  console.error('JWT_SECRET must be set to a random value of at least 32 characters (see .env.example).');
  process.exit(1);
}

await connectDb(env.mongoUri);
const server = createApp().listen(env.port, () => console.log(`API listening on port ${env.port}`));

const shutdown = async () => {
  server.close();
  await disconnectDb();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
