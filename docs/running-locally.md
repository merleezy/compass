# Running Compass Locally

This guide walks you through setting up and running the Compass development environment on your local machine.

---

## Prerequisites

To run this application locally, you must have the following installed:

- [Node.js](https://nodejs.org/) v20+ or v24+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (used to run MongoDB locally without system-wide database installations)

---

## Environment Variables

### Root `.env` (used by Docker Compose)

Create a `.env` file in the project root:

```env
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_password_here
```

### `server/.env` (used by Express)

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://root:your_password_here@localhost:27017/compass?authSource=admin
```

### `client/.env.local` (used by Vite)

Vite uses `.env.local` for local overrides (which are git-ignored). Create `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Project Structure

```
compass/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/           # Feature-specific components (habits, tasks)
│   │   │   ├── ui/                 # Shared UI components (Modal, Cards)
│   │   │   └── layout/             # Layout shell (Sidebar, TopBar)
│   │   ├── pages/                  # Page-level components
│   │   ├── index.css               # Tailwind imports & theme configuration
│   │   └── main.jsx                # App Router entrypoint
│   └── vite.config.js              # Vite config (Tailwind + API Proxy)
│
├── server/                         # Node/Express backend
│   ├── src/
│   │   ├── controllers/            # Controller logic (Habits, Tasks)
│   │   ├── models/                 # Mongoose models (Habit, HabitLog, Task)
│   │   ├── routes/                 # Express API routes
│   │   └── db.js                   # Mongoose connection config
│   ├── server.js                   # Express server entrypoint
│   └── eslint.config.mjs           # Backend ESLint configuration (ESM format)
│
├── docs/                           # Project documentation
├── docker-compose.yml              # MongoDB container orchestration
├── CONTEXT.md                      # Documentation Directory & AI Context
└── README.md                       # Repository landing page
```

---

## Running the App

To run the application, you will need three terminal tabs:

### Terminal 1 — Database

Start the MongoDB container from the project root:

```bash
docker compose up -d
```

> Note: The MongoDB data volume is managed externally. If running for the first time, make sure you have run `docker volume create compass-mongo-data`.

### Terminal 2 — Express Backend

Navigate to the server folder and start the API in development mode:

```bash
cd server
npm run dev
```

- **API Health Check:** `http://localhost:5000/api/health`

### Terminal 3 — Vite Frontend

Navigate to the client folder and start the React dev server:

```bash
cd client
npm run dev
```

- **Frontend Local URL:** `http://localhost:5173`
