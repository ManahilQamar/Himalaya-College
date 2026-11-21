import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { createApp } from '../src/app.js';
import { seed } from '../src/seed/seed.js';
import Admin from '../src/models/Admin.js';
import AdmissionInterest from '../src/models/AdmissionInterest.js';
import ContactMessage from '../src/models/ContactMessage.js';
import { testUri } from './helpers.js';

const ORIGIN = 'http://localhost:5173';
const SECRET = 'test-secret-'.padEnd(48, 'x');
const EMAIL = 'admin@example.com';
const PASSWORD = 'Correct-Horse-9';
const app = createApp({ clientOrigins: [ORIGIN], jwtSecret: SECRET, formLimit: 1000, loginLimit: 1000 });

const agent = request.agent(app);
const as = (a, m, u) => a[m](u).set('Origin', ORIGIN).set('X-Requested-With', 'XMLHttpRequest');
const adm = (m, u) => as(agent, m, u);
const pub = (m, u) => request(app)[m](u).set('Origin', ORIGIN);

before(async () => {
  await connectDb(testUri('himalaya_test_admin'));
  await mongoose.connection.dropDatabase();
  await Promise.all(mongoose.modelNames().map((n) => mongoose.model(n).init()));
  await seed();
  await Admin.create({ name: 'Test Admin', email: EMAIL, passwordHash: await Admin.hashPassword(PASSWORD) });
});
after(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDb();
});

describe('authentication', () => {
  it('admin routes reject requests without a session', async () => {
    for (const url of ['/api/admin/stats', '/api/admin/programs', '/api/admin/college', '/api/admin/admissions', '/api/admin/messages']) {
      await adm('get', url).expect(401);
    }
  });

  it('wrong password and unknown email give the same answer', async () => {
    const a = await adm('post', '/api/admin/auth/login').send({ email: EMAIL, password: 'wrong-password' }).expect(401);
    const b = await adm('post', '/api/admin/auth/login').send({ email: 'nobody@example.com', password: 'wrong-password' }).expect(401);
    assert.equal(a.body.message, b.body.message);
  });

  it('state-changing requests need the anti-CSRF header', async () => {
    await request(app).post('/api/admin/auth/login').set('Origin', ORIGIN).send({ email: EMAIL, password: PASSWORD }).expect(403);
  });

  it('login sets an httpOnly cookie and never returns the hash', async () => {
    const res = await adm('post', '/api/admin/auth/login').send({ email: EMAIL.toUpperCase(), password: PASSWORD }).expect(200);
    const cookie = res.headers['set-cookie'][0];
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Path=\/api\/admin/);
    assert.equal(res.body.admin.email, EMAIL);
    assert.equal(res.body.admin.passwordHash, undefined);
    assert.equal(JSON.stringify(res.body).includes('$2'), false);
  });

  it('me works with the session', async () => {
    assert.equal((await adm('get', '/api/admin/auth/me').expect(200)).body.admin.email, EMAIL);
  });

  it('forged, unsigned and wrong-secret tokens are refused', async () => {
    const admin = await Admin.findOne({ email: EMAIL });
    const tokens = [
      jwt.sign({}, 'another-secret'.padEnd(40, 'y'), { subject: admin.id, expiresIn: '1h' }),
      `${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: admin.id })).toString('base64url')}.`,
      jwt.sign({}, SECRET, { subject: String(new mongoose.Types.ObjectId()), expiresIn: '1h' }), // admin that does not exist
      jwt.sign({}, SECRET, { subject: admin.id, expiresIn: -10 }), // expired
    ];
    for (const t of tokens) {
      await request(app).get('/api/admin/auth/me').set('Origin', ORIGIN).set('Cookie', `hdc_admin=${t}`).expect(401);
    }
  });

  it('login attempts are rate limited', async () => {
    const limited = createApp({ clientOrigins: [ORIGIN], jwtSecret: SECRET, loginLimit: 3 });
    const go = () => as(request(limited), 'post', '/api/admin/auth/login').send({ email: EMAIL, password: 'nope-nope-nope' });
    for (let i = 0; i < 3; i++) await go().expect(401);
    await go().expect(429);
  });
});

describe('login rate limit', () => {
  it('only failed attempts count, so many successful sign-ins from one network are fine', async () => {
    const limited = createApp({ clientOrigins: [ORIGIN], jwtSecret: SECRET, loginLimit: 3 });
    for (let i = 0; i < 6; i++) {
      await as(request(limited), 'post', '/api/admin/auth/login').send({ email: EMAIL, password: PASSWORD }).expect(200);
    }
  });
});

describe('content management', () => {
  let program;

  it('new content starts hidden, then publishing makes it public', async () => {
    const res = await adm('post', '/api/admin/programs').send({ name: 'BS Computer Science', description: 'Four year program', careers: ['Developer'] }).expect(201);
    program = res.body;
    assert.equal(program.slug, 'bs-computer-science');
    assert.equal(program.isPublished, false);
    assert.equal(program.isPlaceholder, false);
    await pub('get', '/api/programs/bs-computer-science').expect(404);
    await adm('patch', `/api/admin/programs/${program.id}/publish`).send({ isPublished: true }).expect(200);
    assert.equal((await pub('get', '/api/programs/bs-computer-science').expect(200)).body.name, 'BS Computer Science');
  });

  it('editing keeps the URL slug stable; deleting removes it from the site', async () => {
    const res = await adm('put', `/api/admin/programs/${program.id}`).send({ name: 'BS Computing', description: 'Changed' }).expect(200);
    assert.equal(res.body.slug, 'bs-computer-science');
    assert.equal(res.body.name, 'BS Computing');
    await adm('delete', `/api/admin/programs/${program.id}`).expect(200);
    await pub('get', '/api/programs/bs-computer-science').expect(404);
    await adm('delete', `/api/admin/programs/${program.id}`).expect(404);
  });

  it('seeded placeholder items can be edited and lose the placeholder flag', async () => {
    const list = (await adm('get', '/api/admin/programs').expect(200)).body;
    assert.ok(list.every((p) => p.isPlaceholder === true));
    const res = await adm('put', `/api/admin/programs/${list[0].id}`).send({ name: 'Real Program', description: 'Real text' }).expect(200);
    assert.equal(res.body.isPlaceholder, false);
  });

  it('validation errors are keyed by field path', async () => {
    const res = await adm('post', '/api/admin/campuses').send({ name: 'Main', coordinator: { email: 'not-an-email' } }).expect(400);
    assert.ok(res.body.errors['coordinator.email']);
    const noName = await adm('post', '/api/admin/programs').send({ description: 'x' }).expect(400);
    assert.ok(noName.body.errors.name);
  });

  it('rejects javascript: links in image fields', async () => {
    const res = await adm('post', '/api/admin/events').send({ title: 'T', category: 'Events', image: 'javascript:alert(1)' }).expect(400);
    assert.ok(res.body.errors.image);
  });

  it('events: dates are validated and unknown categories are refused', async () => {
    await adm('post', '/api/admin/events').send({ title: 'T', category: 'Nope' }).expect(400);
    const bad = await adm('post', '/api/admin/events').send({ title: 'T', category: 'Events', date: 'garbage' }).expect(400);
    assert.ok(bad.body.errors.date);
    const ok = await adm('post', '/api/admin/events').send({ title: 'Open Day', category: 'Events', date: '2026-12-01', isPublished: true, isFeatured: true }).expect(201);
    assert.match(ok.body.date, /^2026-12-01/);
    const latest = await pub('get', '/api/events/latest').expect(200);
    assert.equal(latest.body.title, 'Open Day');
  });

  it('operator objects in bodies are refused', async () => {
    await adm('post', '/api/admin/programs').send({ name: { $gt: '' }, description: 'x' }).expect(400);
  });

  it('services can be created and listed', async () => {
    const res = await adm('post', '/api/admin/services').send({ title: 'Transport', description: 'Bus service', icon: 'Bus' }).expect(201);
    assert.equal(res.body.isPublished, false);
    assert.ok((await adm('get', '/api/admin/services')).body.some((s) => s.title === 'Transport'));
  });
});

describe('submissions and messages', () => {
  before(async () => {
    await AdmissionInterest.create([
      { fullName: '=HYPERLINK("http://evil")', email: 'a@b.co', phone: '+923001234567', city: 'Swabi', preferredProgram: 'program-1', previousQualification: 'FSc', message: 'hi, "there"' },
      { fullName: 'Second Student', email: 'c@d.co', phone: '0300-1234567', city: 'Mardan', preferredProgram: 'not-sure', previousQualification: 'Matric' },
    ]);
    await ContactMessage.create({ name: 'Parent', email: 'p@q.co', phone: '0300-1234567', subject: 'Fees', message: 'What are the fees?' });
  });

  it('stats count what needs attention', async () => {
    const s = (await adm('get', '/api/admin/stats').expect(200)).body;
    assert.equal(s.totalInterests, 2);
    assert.equal(s.newInterests, 2);
    assert.equal(s.unreadMessages, 1);
    assert.ok(s.publishedPrograms >= 3);
    assert.equal(s.recentInterests.length, 2);
  });

  it('lists with pagination and filters, updates status, rejects bad status', async () => {
    const page = (await adm('get', '/api/admin/admissions?limit=1').expect(200)).body;
    assert.equal(page.items.length, 1);
    assert.equal(page.total, 2);
    assert.equal(page.pages, 2);
    const id = page.items[0].id;
    assert.equal((await adm('patch', `/api/admin/admissions/${id}`).send({ status: 'contacted' }).expect(200)).body.status, 'contacted');
    await adm('patch', `/api/admin/admissions/${id}`).send({ status: 'done' }).expect(400);
    assert.equal((await adm('get', '/api/admin/admissions?status=contacted')).body.total, 1);
    await adm('get', '/api/admin/admissions?status[$ne]=x').expect(400);
    await adm('patch', '/api/admin/admissions/not-an-id').send({ status: 'closed' }).expect(404);
  });

  it('CSV export neutralises spreadsheet formulas and keeps phone numbers', async () => {
    const res = await adm('get', '/api/admin/admissions/export.csv').expect(200);
    assert.match(res.headers['content-type'], /text\/csv/);
    assert.match(res.text, /"'=HYPERLINK/);
    assert.match(res.text, /"\+923001234567"/);
    assert.match(res.text, /"hi, ""there"""/);
  });

  it('messages: mark read, then delete', async () => {
    const list = (await adm('get', '/api/admin/messages?unread=true').expect(200)).body;
    assert.equal(list.items.length, 1);
    const id = list.items[0].id;
    assert.equal((await adm('patch', `/api/admin/messages/${id}`).send({ isRead: true }).expect(200)).body.isRead, true);
    assert.equal((await adm('get', '/api/admin/messages?unread=true')).body.items.length, 0);
    await adm('delete', `/api/admin/messages/${id}`).expect(200);
    await adm('delete', `/api/admin/messages/${id}`).expect(404);
  });
});

describe('college information', () => {
  it('saving contact details updates the public site', async () => {
    await adm('put', '/api/admin/college/contact').send({ phones: ['0300-1111111'], whatsapp: '03001111111', email: 'info@example.com', address: 'KSK, Razar, Swabi', officeHours: 'Mon-Fri 8am-2pm' }).expect(200);
    const pubCollege = (await pub('get', '/api/college').expect(200)).body;
    assert.deepEqual(pubCollege.contact.phones, ['0300-1111111']);
    assert.equal(pubCollege.contact.officeHours, 'Mon-Fri 8am-2pm');
  });

  it('stats can be set and cleared; negative numbers are refused', async () => {
    const home = (await adm('get', '/api/admin/college')).body.home;
    const stats = home.stats.map((s, i) => ({ ...s, value: i === 0 ? 12 : null }));
    await adm('put', '/api/admin/college/home').send({ intro: home.intro, stats }).expect(200);
    assert.equal((await pub('get', '/api/college')).body.home.stats[0].value, 12);
    await adm('put', '/api/admin/college/home').send({ intro: home.intro, stats: [{ label: 'X', value: -5, suffix: '' }] }).expect(400);
  });

  it('saving the MD message clears its placeholder flag; unknown sections are 404', async () => {
    assert.equal((await pub('get', '/api/college')).body.mdMessage.isPlaceholder, true);
    await adm('put', '/api/admin/college/mdMessage').send({ name: 'MD Sikandar Hayat', designation: 'Managing Director', message: ['Approved text'], vision: 'V', mission: 'M', goals: 'G' }).expect(200);
    const md = (await pub('get', '/api/college')).body.mdMessage;
    assert.equal(md.isPlaceholder, false);
    assert.deepEqual(md.message, ['Approved text']);
    // a real message paragraph is much longer than 300 characters
    await adm('put', '/api/admin/college/mdMessage').send({ name: 'MD Sikandar Hayat', message: ['A'.repeat(2500)] }).expect(200);
    await adm('put', '/api/admin/college/key').send({}).expect(404);
  });
});

describe('password change and logout', () => {
  it('rejects wrong current and weak new passwords', async () => {
    const wrong = await adm('put', '/api/admin/auth/password').send({ currentPassword: 'nope', newPassword: 'A-Long-New-Pass-1' }).expect(400);
    assert.ok(wrong.body.errors.currentPassword);
    const weak = await adm('put', '/api/admin/auth/password').send({ currentPassword: PASSWORD, newPassword: 'short' }).expect(400);
    assert.ok(weak.body.errors.newPassword);
  });

  it('changing the password signs other sessions out but keeps this one', async () => {
    const other = request.agent(app);
    await as(other, 'post', '/api/admin/auth/login').send({ email: EMAIL, password: PASSWORD }).expect(200);
    await as(other, 'get', '/api/admin/auth/me').expect(200);
    await new Promise((r) => setTimeout(r, 1100)); // token timestamps have 1 second resolution
    await adm('put', '/api/admin/auth/password').send({ currentPassword: PASSWORD, newPassword: 'A-Long-New-Pass-1' }).expect(200);
    await adm('get', '/api/admin/auth/me').expect(200);
    await as(other, 'get', '/api/admin/auth/me').expect(401);
    await as(request(app), 'post', '/api/admin/auth/login').send({ email: EMAIL, password: PASSWORD }).expect(401);
    await as(request(app), 'post', '/api/admin/auth/login').send({ email: EMAIL, password: 'A-Long-New-Pass-1' }).expect(200);
  });

  it('logout clears the cookie', async () => {
    const res = await adm('post', '/api/admin/auth/logout').expect(200);
    assert.match(res.headers['set-cookie'][0], /hdc_admin=;/);
    await adm('get', '/api/admin/auth/me').expect(401);
  });
});

describe('request size limits', () => {
  it('the admin area accepts longer content than public forms, but not unlimited', async () => {
    const a = request.agent(app);
    await as(a, 'post', '/api/admin/auth/login').send({ email: EMAIL, password: 'A-Long-New-Pass-1' }).expect(200);
    const big = Array.from({ length: 50 }, () => 'y'.repeat(200)); // valid fields, about 23kb in total
    await as(a, 'post', '/api/admin/campuses').send({ name: 'Big Campus', intro: 'z'.repeat(3000), facilities: big, programs: big }).expect(201);
    await pub('post', '/api/contact').send({ name: 'Sara Ahmed', email: 's@e.co', phone: '0300-1234567', subject: 'Hi there', message: 'x'.repeat(30000) }).expect(413);
    await as(a, 'post', '/api/admin/events').send({ title: 'Huge', category: 'Events', fullDescription: 'x'.repeat(150000) }).expect(413);
  });
});

describe('hardening', () => {
  const LOCK_EMAIL = 'lock@example.com';
  const LOCK_PASSWORD = 'Sturdy-Pencil-42';
  const strict = createApp({ clientOrigins: [ORIGIN], jwtSecret: SECRET, loginLimit: 1000, lockoutMax: 3, lockoutMs: 60_000 });
  const login = (email, password, a = request(strict)) => as(a, 'post', '/api/admin/auth/login').send({ email, password });
  let lockAdmin;

  before(async () => {
    lockAdmin = await Admin.create({ name: 'Lock Test', email: LOCK_EMAIL, passwordHash: await Admin.hashPassword(LOCK_PASSWORD) });
  });

  it('a few wrong passwords do not lock the account, and a good login resets the count', async () => {
    await login(LOCK_EMAIL, 'wrong-one-1').expect(401);
    await login(LOCK_EMAIL, 'wrong-two-2').expect(401);
    await login(LOCK_EMAIL, LOCK_PASSWORD).expect(200);
    await login(LOCK_EMAIL, 'wrong-three-3').expect(401);
    await login(LOCK_EMAIL, 'wrong-four-4').expect(401);
    await login(LOCK_EMAIL, LOCK_PASSWORD).expect(200); // still not locked: the counter was reset
  });

  it('repeated failures lock the account, even against the correct password', async () => {
    for (let i = 0; i < 3; i++) await login(LOCK_EMAIL, `wrong-${i}-guess`).expect(401);
    const locked = await login(LOCK_EMAIL, LOCK_PASSWORD).expect(401);
    const unknown = await login('nobody@example.com', LOCK_PASSWORD).expect(401);
    assert.equal(locked.body.message, unknown.body.message, 'locked and unknown accounts must look the same');
    const row = await Admin.findOne({ email: LOCK_EMAIL });
    assert.ok(row.lockedUntil > new Date());
    assert.ok(await mongoose.model('AuditLog').exists({ action: 'account_locked', adminEmail: LOCK_EMAIL }));
  });

  it('the lock ends by itself', async () => {
    await Admin.updateOne({ email: LOCK_EMAIL }, { lockedUntil: new Date(Date.now() - 1000) });
    await login(LOCK_EMAIL, LOCK_PASSWORD).expect(200);
    const row = await Admin.findOne({ email: LOCK_EMAIL });
    assert.equal(row.failedLogins, 0);
    assert.equal(row.lockedUntil, null);
  });

  it('lockout details are never sent to the browser', async () => {
    const a = request.agent(strict);
    const res = await login(LOCK_EMAIL, LOCK_PASSWORD, a).expect(200);
    assert.equal(res.body.admin.failedLogins, undefined);
    assert.equal(res.body.admin.lockedUntil, undefined);
    const me = await as(a, 'get', '/api/admin/auth/me').expect(200);
    assert.equal(me.body.admin.lockedUntil, undefined);
  });

  it('admin responses are never cacheable', async () => {
    const res = await adm('post', '/api/admin/auth/login').send({ email: EMAIL, password: 'A-Long-New-Pass-1' }).expect(200);
    assert.equal(res.headers['cache-control'], 'no-store');
    assert.equal((await adm('get', '/api/admin/stats')).headers['cache-control'], 'no-store');
  });

  it('the activity log records who did what, without form contents, and needs a login', async () => {
    await request(app).get('/api/admin/audit').set('Origin', ORIGIN).expect(401);
    const created = await adm('post', '/api/admin/programs').send({ name: 'Audit Program', description: 'secret-body-text' }).expect(201);
    await adm('patch', `/api/admin/programs/${created.body.id}/publish`).send({ isPublished: true }).expect(200);
    await adm('delete', `/api/admin/programs/${created.body.id}`).expect(200);
    const log = (await adm('get', '/api/admin/audit?limit=50').expect(200)).body;
    const mine = log.items.filter((i) => i.label === 'Audit Program').map((i) => i.action).sort();
    assert.deepEqual(mine, ['create', 'delete', 'publish']);
    const entry = log.items.find((i) => i.action === 'create');
    assert.equal(entry.adminEmail, EMAIL);
    assert.ok(entry.ip);
    assert.equal(JSON.stringify(log).includes('secret-body-text'), false);
    assert.ok(log.items.some((i) => i.action === 'login'));
    assert.ok(log.items.some((i) => i.action === 'login_failed'));
  });

  it('unknown emails typed at the login form are not stored', async () => {
    await login('typed-a-password-here@example.com', 'whatever-123').expect(401);
    assert.equal(await mongoose.model('AuditLog').exists({ adminEmail: 'typed-a-password-here@example.com' }), null);
  });

  it('password policy blocks guessable passwords', async () => {
    const try_ = (pw) => adm('put', '/api/admin/auth/password').send({ currentPassword: 'A-Long-New-Pass-1', newPassword: pw });
    assert.ok((await try_('Password12345').expect(400)).body.errors.newPassword);
    assert.ok((await try_('1234567890123').expect(400)).body.errors.newPassword);
    assert.ok((await try_('xxxxxxxxxxxx').expect(400)).body.errors.newPassword);
    assert.ok((await try_('Admin-Himalaya-2026').expect(400)).body.errors.newPassword);
    assert.ok((await try_(`${EMAIL.split('@')[0]}-is-me-99`).expect(400)).body.errors.newPassword);
  });

  it('"sign out everywhere" ends every session including the current one', async () => {
    const a = request.agent(app);
    const b = request.agent(app);
    await as(a, 'post', '/api/admin/auth/login').send({ email: EMAIL, password: 'A-Long-New-Pass-1' }).expect(200);
    await as(b, 'post', '/api/admin/auth/login').send({ email: EMAIL, password: 'A-Long-New-Pass-1' }).expect(200);
    await as(a, 'get', '/api/admin/auth/me').expect(200);
    await as(a, 'post', '/api/admin/auth/logout-all').expect(200);
    await as(a, 'get', '/api/admin/auth/me').expect(401);
    await as(b, 'get', '/api/admin/auth/me').expect(401);
    // signing in again afterwards works normally
    await new Promise((r) => setTimeout(r, 1100));
    await as(request(app), 'post', '/api/admin/auth/login').send({ email: EMAIL, password: 'A-Long-New-Pass-1' }).expect(200);
  });
});
