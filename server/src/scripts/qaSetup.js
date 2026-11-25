import { z } from 'zod';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../config/db.js';
import { seed } from '../seed/seed.js';
import Admin from '../models/Admin.js';
import '../models/AdmissionInterest.js';
import '../models/AuditLog.js';
import '../models/Campus.js';
import '../models/CollegeInformation.js';
import '../models/ContactMessage.js';
import '../models/Event.js';
import '../models/Program.js';
import '../models/Service.js';

// Prepares a TEST database for the scripts in /qa: wipes it, adds the sample content and two test admin accounts.
// It refuses to touch any database whose name does not contain "test", "qa" or "e2e".
const name = new URL(env.mongoUri || 'mongodb://x/none').pathname.slice(1);
if (!env.mongoUri || !/test|qa|e2e/i.test(name)) {
  console.error(`Refusing to wipe "${name || '(none)'}". Use a separate test database, for example mongodb://127.0.0.1:27017/himalaya_qa`);
  process.exit(1);
}
z.string().min(1).parse(name);

await connectDb(env.mongoUri);
await mongoose.connection.dropDatabase();
await Promise.all(mongoose.modelNames().map((n) => mongoose.model(n).init())); // recreate indexes
await seed();
for (const [adminName, email, password] of [
  ['Test Admin', 'admin@hdc.test', 'Initial-Pass-2026'],
  ['Lock Me', 'lockme@hdc.test', 'Another-Pass-2026'],
]) {
  await Admin.create({ name: adminName, email, passwordHash: await Admin.hashPassword(password) });
}
console.log(`QA database "${name}" is ready (sample content + 2 test admins).`);
await disconnectDb();
