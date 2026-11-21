# Himalaya Degree College website

MERN stack: `client/` (React, Vite, Tailwind, Framer Motion) and `server/` (Express, MongoDB).

## Run everything
1. Server: see `server/README.md` (needs a MongoDB connection string and a JWT_SECRET in `server/.env`).
2. Client (Node 20.19 or newer):

       cd client
       cp .env.example .env     # VITE_API_URL=/api  (Vite forwards /api to http://localhost:5000)
       npm install
       npm run dev              # http://localhost:5173

Putting it online: see `DEPLOYMENT.md`.

If `VITE_API_URL` is empty the website runs on its own with built-in placeholder content (forms are not saved).

## Status
Stages 1 to 10 done: design system, all public pages, events, contact, backend API and database, admin dashboard with login, security hardening, deployment guide, responsive and accessibility pass.
Next: SEO and performance (11), final testing (12).

Admin panel: open `/admin` on the website (not linked from public pages). Create the first admin with `npm run create-admin` in `server/`.
