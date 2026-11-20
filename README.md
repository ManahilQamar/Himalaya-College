# Himalaya Degree College website

MERN stack: `client/` (React, Vite, Tailwind, Framer Motion) and `server/` (Express, MongoDB).

## Run everything
1. Server: see `server/README.md` (needs a MongoDB connection string in `server/.env`).
2. Client:

       cd client
       cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
       npm install
       npm run dev              # http://localhost:5173

If `VITE_API_URL` is empty the website runs on its own with built-in placeholder content (forms are not saved).

## Status
Stages 1 to 8 done: design system, all public pages, events, contact, backend API and database, admin dashboard with login.
Next: security hardening (9), responsive polish (10), SEO and performance (11), final testing (12).

Admin panel: open `/admin` on the website (not linked from public pages). Create the first admin with `npm run create-admin` in `server/`.
