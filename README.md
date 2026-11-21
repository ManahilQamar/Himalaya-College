# Himalaya Degree College

Website and content management system for Himalaya Degree College.

The project includes a React frontend, Express API, MongoDB integration, and an admin panel for managing website content.

## Project Structure

```text
himalaya-college/
├── client/          # React frontend
├── server/          # Express backend
├── DEPLOYMENT.md
└── README.md
```

## Frontend

The frontend is built with:

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Lucide Icons

### Run the frontend

```bash
cd client
npm install
npm run dev
```

The development server runs on:

```text
http://localhost:5173
```

For local API configuration, create `client/.env` from `client/.env.example`.

## Backend

The backend is built with:

- Node.js
- Express
- MongoDB
- JWT authentication

### Run the backend

```bash
cd server
npm install
npm run dev
```

The backend requires environment variables for the MongoDB connection and JWT authentication.

Use `server/.env.example` as a reference for the required configuration.

## Admin Panel

The admin panel is available at:

```text
/admin
```

It is not linked from the public website.

The admin area provides authenticated access to website content and administrative features.

## Testing

Backend tests are located in:

```text
server/tests/
```

Run the backend test suite with:

```bash
cd server
npm test
```

## Production Build

To create a production build of the frontend:

```bash
cd client
npm run build
```

The production files are generated in:

```text
client/dist/
```

## Deployment

Deployment instructions are available in:

`DEPLOYMENT.md`

## Environment Files

Environment files containing passwords, database credentials, JWT secrets, or other private values are not committed to the repository.

Use the provided `.env.example` files when setting up the project locally or on a server.