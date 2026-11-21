# Server (Express + MongoDB)

## Setup
1. Create a free MongoDB Atlas cluster (or use a local MongoDB) and copy its connection string.
2. `cp .env.example .env` and fill in `MONGODB_URI`, `CLIENT_ORIGIN` and `JWT_SECRET`.
   Generate the secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   The server refuses to start without a JWT_SECRET of at least 32 characters.
3. Install, add the placeholder content, create the first admin, and start:

       npm install
       npm run seed          # safe to repeat: only fills what is missing, never overwrites edits
       npm run create-admin  # asks for name, email and a hidden password (min 10 characters)
       npm run dev           # http://localhost:5000

   `create-admin` can also reset a forgotten password: run it again with the same email.

## Tests
Runs against a real MongoDB on `mongodb://127.0.0.1:27017` (override with `MONGODB_TEST_BASE`).
It uses its own databases (`himalaya_test_public`, `himalaya_test_admin`) which are wiped, so never point it at real data.

       npm test

## Public API (Stage 7)
| Method | Path | Notes |
|---|---|---|
| GET | /api/health | |
| GET | /api/college | about, home texts and stats, MD message, admissions info, contact |
| GET | /api/services | published only |
| GET | /api/programs, /api/programs/:slug | published only |
| GET | /api/campuses, /api/campuses/:slug | published only |
| GET | /api/events?category=&status= | published only |
| GET | /api/events/latest | the navbar announcement |
| GET | /api/events/:id | |
| POST | /api/admissions | rate limited, validated, honeypot |
| POST | /api/contact | rate limited, validated, honeypot |

## Admin API (Stage 8), all under /api/admin
Sign-in uses an httpOnly cookie (8 hours). Every write request must send the header `X-Requested-With: XMLHttpRequest`.

| Method | Path | Notes |
|---|---|---|
| POST | /auth/login, /auth/logout | 5 wrong passwords lock the account for 15 minutes; 10 failed attempts per IP per 15 minutes |
| GET | /auth/me | |
| PUT | /auth/password | signs out all other sessions |
| POST | /auth/logout-all | signs out every session, including this one |
| GET | /audit | activity log (who did what, 180 days) |
| GET | /stats | counts for the dashboard |
| GET, POST, PUT, DELETE, PATCH | /programs, /services, /campuses, /events | PATCH /:id/publish toggles visibility |
| GET, PATCH, DELETE | /admissions, /messages | paginated; GET /admissions/export.csv |
| GET, PUT | /college, /college/:section | sections: about, home, mdMessage, admissions, contact |

New content starts unpublished. Saving an item marks it as real content (the "Placeholder" badge disappears).
