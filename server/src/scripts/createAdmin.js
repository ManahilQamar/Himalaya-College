import readline from 'node:readline';
import { Writable } from 'node:stream';
import { z } from 'zod';
import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../config/db.js';
import Admin from '../models/Admin.js';
import { passwordProblem } from '../lib/password.js';

// Creates the first admin (or resets the password of an existing one).
// Interactive: the password is typed hidden and only its hash is stored.
// Non-interactive: ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
let muted = false;
const out = new Writable({
  write(chunk, enc, cb) {
    if (!muted) process.stdout.write(chunk, enc);
    cb();
  },
});
const rl = readline.createInterface({ input: process.stdin, output: out, terminal: Boolean(process.stdin.isTTY) });
const ask = (question, hidden = false) =>
  new Promise((resolve) => {
    process.stdout.write(question);
    muted = hidden;
    rl.question('', (answer) => {
      muted = false;
      if (hidden) process.stdout.write('\n');
      resolve(answer.trim());
    });
  });

if (!env.mongoUri) { console.error('MONGODB_URI is not set.'); process.exit(1); }

const name = process.env.ADMIN_NAME || (await ask('Name: '));
const email = process.env.ADMIN_EMAIL || (await ask('Email: '));
let password = process.env.ADMIN_PASSWORD;
if (!password) {
  password = await ask('Password (at least 10 characters, hidden): ', true);
  if (password !== (await ask('Repeat password: ', true))) { console.error('The passwords do not match.'); process.exit(1); }
}
rl.close();

const parsed = z
  .object({ name: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), password: z.string().min(10).max(128) })
  .safeParse({ name, email, password });
if (!parsed.success) {
  console.error('Invalid input:', parsed.error.issues.map((i) => `${i.path[0]}: ${i.message}`).join('; '));
  process.exit(1);
}

const weak = passwordProblem(parsed.data.password, parsed.data.email);
if (weak) { console.error(`Password rejected: ${weak}.`); process.exit(1); }

await connectDb(env.mongoUri);
const passwordHash = await Admin.hashPassword(parsed.data.password);
const existing = await Admin.findOne({ email: parsed.data.email });
if (existing) {
  existing.set({ name: parsed.data.name, passwordHash, passwordChangedAt: new Date() });
  await existing.save();
  console.log(`Password updated for ${existing.email}. Their other sessions were signed out.`);
} else {
  await Admin.create({ name: parsed.data.name, email: parsed.data.email, passwordHash });
  console.log(`Admin created: ${parsed.data.email}`);
}
await disconnectDb();
