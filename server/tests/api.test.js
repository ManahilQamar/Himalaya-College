import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { createApp } from '../src/app.js';
import { testUri } from './helpers.js';
import { seed } from '../src/seed/seed.js';
import Admin from '../src/models/Admin.js';
import AdmissionInterest from '../src/models/AdmissionInterest.js';
import ContactMessage from '../src/models/ContactMessage.js';
import Event from '../src/models/Event.js';
import Program from '../src/models/Program.js';

const ORIGIN = 'http://localhost:5173';
const app = createApp({ clientOrigins: [ORIGIN], formLimit: 1000 });
const api = (method, url) => request(app)[method](url).set('Origin', ORIGIN);

const interest = {
  fullName: 'Ali Khan', email: 'Ali@Example.com', phone: '0300-1234567', city: 'Swabi',
  preferredProgram: 'program-1', previousQualification: 'FSc', message: 'Hello',
};
const contact = { name: 'Sara Ahmed', email: 'sara@example.com', phone: '0345-1234567', subject: 'Question', message: 'Which documents are needed?' };

before(async () => {
  await connectDb(testUri('himalaya_test_public'));
  await mongoose.connection.dropDatabase();
  await Promise.all(mongoose.modelNames().map((n) => mongoose.model(n).init()));
});
after(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDb();
});

describe('seed', () => {
  it('fills an empty database, then keeps existing content on the second run', async () => {
    const first = await seed();
    assert.equal(first.college, 'created');
    assert.equal(first.programs, 'created 3');
    const second = await seed();
    assert.deepEqual(Object.values(second), ['kept', 'kept', 'kept', 'kept', 'kept']);
  });
});

describe('public content', () => {
  it('health check', async () => {
    const res = await api('get', '/api/health').expect(200);
    assert.equal(res.body.ok, true);
  });

  it('college info has no internal fields', async () => {
    const { body } = await api('get', '/api/college').expect(200);
    assert.equal(body.mdMessage.name, 'MD Sikandar Hayat');
    assert.equal(body.home.stats.length, 4);
    assert.equal(body.home.stats[0].value, null);
    assert.ok(body.id);
    assert.equal(body._id, undefined);
    assert.equal(body.__v, undefined);
  });

  it('services and campuses load; coordinator is empty by default', async () => {
    const services = await api('get', '/api/services').expect(200);
    assert.equal(services.body.length, 9);
    const { body: campuses } = await api('get', '/api/campuses').expect(200);
    assert.equal(campuses.length, 2);
    assert.deepEqual(Object.values(campuses[0].coordinator).filter(Boolean), []);
    await api('get', '/api/campuses/campus-1').expect(200);
    await api('get', '/api/campuses/nope').expect(404);
  });

  it('programs: only published ones, by slug, 404 when unknown or unpublished', async () => {
    assert.equal((await api('get', '/api/programs').expect(200)).body.length, 3);
    await Program.updateOne({ slug: 'program-3' }, { isPublished: false });
    assert.equal((await api('get', '/api/programs').expect(200)).body.length, 2);
    await api('get', '/api/programs/program-3').expect(404);
    const ok = await api('get', '/api/programs/program-1').expect(200);
    assert.equal(ok.body.slug, 'program-1');
    await api('get', '/api/programs/nope').expect(404);
  });

  it('new programs get a unique slug automatically', async () => {
    const a = await Program.create({ name: 'BS Computer Science', description: 'x' });
    const b = await Program.create({ name: 'BS Computer Science', description: 'y' });
    assert.equal(a.slug, 'bs-computer-science');
    assert.equal(b.slug, 'bs-computer-science-2');
    assert.equal(a.isPublished, false); // new content is hidden until published
  });
});

describe('events', () => {
  it('lists published events ordered by status and filters by category/status', async () => {
    const { body } = await api('get', '/api/events').expect(200);
    assert.equal(body.length, 5);
    assert.equal(body[0].status, 'Ongoing');
    assert.equal(body.at(-1).status, 'Completed');
    assert.equal((await api('get', '/api/events?category=Results')).body.length, 1);
    assert.equal((await api('get', '/api/events?status=Upcoming')).body.length, 3);
  });

  it('rejects unknown filters and NoSQL operator tricks', async () => {
    await api('get', '/api/events?category=Nope').expect(400);
    await api('get', '/api/events?category[$ne]=x').expect(400);
  });

  it('latest announcement prefers the featured, live event', async () => {
    const { body } = await api('get', '/api/events/latest').expect(200);
    assert.equal(body.category, 'Admissions');
    assert.equal(body.isFeatured, true);
  });

  it('detail by id; 404 for bad id, unknown id and unpublished event', async () => {
    const e = await Event.findOne({ category: 'Seminars' });
    const ok = await api('get', `/api/events/${e.id}`).expect(200);
    assert.equal(ok.body.id, e.id);
    await api('get', '/api/events/not-an-id').expect(404);
    await api('get', `/api/events/${new mongoose.Types.ObjectId()}`).expect(404);
    await Event.updateOne({ _id: e.id }, { isPublished: false });
    await api('get', `/api/events/${e.id}`).expect(404);
    assert.equal((await api('get', '/api/events')).body.length, 4);
  });
});

describe('admission interest form', () => {
  it('stores a valid submission with status "new" and a normalised email', async () => {
    await api('post', '/api/admissions').send(interest).expect(201);
    const doc = await AdmissionInterest.findOne();
    assert.equal(doc.fullName, 'Ali Khan');
    assert.equal(doc.email, 'ali@example.com');
    assert.equal(doc.status, 'new');
  });

  it('returns field errors for bad input and stores nothing', async () => {
    const before = await AdmissionInterest.countDocuments();
    const res = await api('post', '/api/admissions').send({ ...interest, email: 'nope', phone: '1', fullName: '' }).expect(400);
    assert.ok(res.body.errors.email && res.body.errors.phone && res.body.errors.fullName);
    assert.equal(await AdmissionInterest.countDocuments(), before);
  });

  it('ignores fields the client must not set (status)', async () => {
    await api('post', '/api/admissions').send({ ...interest, status: 'closed', isAdmin: true }).expect(201);
    const docs = await AdmissionInterest.find();
    assert.ok(docs.every((d) => d.status === 'new'));
  });

  it('rejects operator objects instead of strings', async () => {
    await api('post', '/api/admissions').send({ ...interest, fullName: { $gt: '' } }).expect(400);
  });

  it('honeypot: looks successful to bots but stores nothing', async () => {
    const before = await AdmissionInterest.countDocuments();
    await api('post', '/api/admissions').send({ ...interest, website: 'http://spam.example' }).expect(201);
    assert.equal(await AdmissionInterest.countDocuments(), before);
  });
});

describe('contact form', () => {
  it('stores a valid message as unread', async () => {
    await api('post', '/api/contact').send(contact).expect(201);
    const doc = await ContactMessage.findOne();
    assert.equal(doc.isRead, false);
    assert.equal(doc.subject, 'Question');
  });
  it('validates input', async () => {
    const res = await api('post', '/api/contact').send({ ...contact, message: 'short' }).expect(400);
    assert.ok(res.body.errors.message);
  });
});

describe('security and error handling', () => {
  it('unknown routes return JSON 404', async () => {
    const res = await api('get', '/api/nothing-here').expect(404);
    assert.equal(res.body.message, 'Not found');
  });
  it('blocks other origins (CORS)', async () => {
    await request(app).get('/api/health').set('Origin', 'https://evil.example').expect(403);
  });
  it('rejects oversized bodies', async () => {
    await api('post', '/api/contact').send({ ...contact, message: 'x'.repeat(30000) }).expect(413);
  });
  it('rejects invalid JSON cleanly', async () => {
    await api('post', '/api/contact').set('Content-Type', 'application/json').send('{bad').expect(400);
  });
  it('sets security headers and hides the framework', async () => {
    const res = await api('get', '/api/health');
    assert.equal(res.headers['x-powered-by'], undefined);
    assert.ok(res.headers['x-content-type-options']);
  });
  it('rate limits form submissions', async () => {
    const limited = createApp({ clientOrigins: [ORIGIN], formLimit: 2 });
    const post = () => request(limited).post('/api/contact').set('Origin', ORIGIN).send(contact);
    await post().expect(201);
    await post().expect(201);
    await post().expect(429);
  });
  it('admin passwords are hashed and never serialised', async () => {
    const admin = await Admin.create({ name: 'Test', email: 'a@b.co', passwordHash: await Admin.hashPassword('S3cret-pass!') });
    const stored = await Admin.findById(admin.id).select('+passwordHash');
    assert.notEqual(stored.passwordHash, 'S3cret-pass!');
    assert.ok(await stored.verifyPassword('S3cret-pass!'));
    assert.equal(await stored.verifyPassword('wrong'), false);
    assert.equal(JSON.parse(JSON.stringify(stored)).passwordHash, undefined);
  });
});
