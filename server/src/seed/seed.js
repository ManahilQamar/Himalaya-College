import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../config/db.js';
import Campus from '../models/Campus.js';
import CollegeInformation from '../models/CollegeInformation.js';
import Event from '../models/Event.js';
import Program from '../models/Program.js';
import Service from '../models/Service.js';
import { campuses, college, events, programs, services } from './data.js';

// Safe to run more than once: it only fills things that are missing and never overwrites edits.
export async function seed() {
  const report = {};
  report.college = (await CollegeInformation.exists({ key: 'main' })) ? 'kept' : (await CollegeInformation.create(college), 'created');
  for (const [name, Model, docs] of [
    ['services', Service, services],
    ['programs', Program, programs],
    ['campuses', Campus, campuses],
    ['events', Event, events],
  ]) {
    if (await Model.estimatedDocumentCount()) report[name] = 'kept';
    else { await Model.create(docs); report[name] = `created ${docs.length}`; }
  }
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!env.mongoUri) { console.error('MONGODB_URI is not set.'); process.exit(1); }
  await connectDb(env.mongoUri);
  console.log(await seed());
  await disconnectDb();
}
