# Deployment guide (free tiers)

Recommended setup: **MongoDB Atlas** (database) + **Render** (API) + **Vercel** (website).
The website forwards `/api` to the API (see `client/vercel.json`), so visitors and the admin only ever talk to
one address. This keeps the admin login cookie first-party, which works in every browser including Safari.

## 1. Database (MongoDB Atlas, free M0)
1. Create a free cluster at mongodb.com/atlas.
2. Database Access: add a user with a long random password and the role "Read and write to any database".
3. Network Access: Render's free plan has changing IP addresses, so allow `0.0.0.0/0`. The strong database
   password and the fact that only your API knows the connection string are what protect the database.
4. Connect, then copy the connection string and add the database name: `.../himalaya_college?retryWrites=true&w=majority`.
5. Atlas free clusters do not include backups. Export the data now and then (Atlas "Export" or `mongodump`).

## 2. API (Render, free web service)
- New Web Service from your Git repository, **Root Directory** `server`, Build `npm install`, Start `npm start`,
  Health Check Path `/api/health`.
- Environment variables:

  | Name | Value |
  |---|---|
  | NODE_ENV | production |
  | MONGODB_URI | the Atlas string from step 1 |
  | CLIENT_ORIGIN | the exact website address, for example `https://www.yourcollege.edu.pk` |
  | JWT_SECRET | 48+ random characters (see `server/.env.example`) |
  | TRUST_PROXY | 2 |

- The free plan sleeps after inactivity, so the first visit after a quiet period can take about 30 seconds.

## 3. First content and first admin
Run these once on your own computer, with the Atlas string in `server/.env`:

    cd server
    npm install
    npm run seed            # placeholder content, safe to repeat
    npm run create-admin    # name, email, hidden password (at least 10 characters)

Then remove the Atlas string from your local `.env` or keep that file private.

## 4. Website (Vercel)
1. Open `client/vercel.json` and replace `REPLACE-WITH-YOUR-API-HOST` with your Render address
   (for example `himalaya-api.onrender.com`). Commit.
2. New Project from the same repository, **Root Directory** `client`, framework Vite.
3. Environment variables: `VITE_API_URL=/api` and `VITE_SITE_URL=https://www.yourcollege.edu.pk`.
4. Deploy. Add your own domain in Vercel, then update `CLIENT_ORIGIN` on Render to the same address.

## 5. Check that it works
- `https://your-site/api/health` shows `{"ok":true}`.
- `https://your-site/admin` signs in, and edits appear on the public pages.
- Admin, Activity log: sign in from your phone and from your computer. The two IP addresses should differ.
  If they are the same, `TRUST_PROXY` is wrong (this also affects rate limits).
- Open the site in Safari and sign in to the admin once.

## 6. Security checklist
- [ ] `JWT_SECRET` is long and random, and exists only in Render's settings.
- [ ] Every admin has a unique, strong password. Remove accounts of people who leave (ask for a delete option, or remove it in Atlas).
- [ ] `.env` files are never committed (they are in `.gitignore`).
- [ ] Run `npm audit` in `client` and `server` every month, and update packages when it reports problems.
- [ ] Read the admin **Activity log** now and then. Failed sign-ins and "account locked" lines are marked as security events.
- [ ] After sign-in on a shared computer or a lost phone: Settings, "Sign out of all devices", then change the password.
- [ ] Images are added as https links. Only use images you have the right to publish.

## What protects the site
- Sign-in: passwords hashed with bcrypt, httpOnly session cookie (8 hours), 5 wrong passwords lock the account for
  15 minutes, 10 failed attempts per IP in 15 minutes, identical error messages for every failure.
- Requests: validation on every field, size limits, NoSQL-operator stripping, CORS limited to your website, a custom
  header on all admin writes (CSRF), `no-store` on admin responses, form spam traps, rate limits on forms.
- Browser: Content-Security-Policy, clickjacking protection, `nosniff`, strict referrer policy, HSTS (see `client/vercel.json`).
- Accountability: the Activity log records sign-ins and every change (never the contents of forms) for 180 days.

## Known limits
- Rate limits are counted in memory, so they assume one API instance (the free plan). Use Redis if you scale out.
- There is no email sending, so a forgotten admin password is reset with `npm run create-admin` (same email).
