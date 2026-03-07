# Compass 🧭

A personal life dashboard for tracking habits, goals, reflections, and financial progress over time. Compass acts as a personal operating system to help you stay aligned with your long-term direction and make consistent daily progress.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB (via Docker) |
| Charts | Recharts |
| HTTP Client | Axios |
| Routing | React Router DOM |

---

## Prerequisites

Make sure you have the following installed before setting up the project:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with WSL 2 integration enabled)
- Git

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/merleezy/compass.git
cd compass
```

### 2. Set Up Environment Variables

Copy the example env files and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set the following:

```
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_password_here

PORT=5000
MONGODB_URI=mongodb://root:your_password_here@localhost:27017/compass?authSource=admin
```

### 3. Create the Docker Volume

This only needs to be done once. It creates the persistent storage for MongoDB:

```bash
docker volume create compass-mongo-data
```

### 4. Install Dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

---

## Running the App

You'll need three terminals running simultaneously:

```bash
# Terminal 1 — Start MongoDB container (from project root)
docker compose up -d

# Terminal 2 — Start the backend server
cd server && npm run dev

# Terminal 3 — Start the frontend
cd client && npm run dev
```

Then open your browser to:
- **Frontend:** http://localhost:5173
- **API Health Check:** http://localhost:5000/api/health

---

## Stopping the App

```bash
# Stop the MongoDB container
docker compose down

# Your data is safe — it's persisted in the Docker volume
```

---

## API Overview

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check if the server is running |

> More endpoints will be added as features are built out.

---

## Roadmap

### MVP
- [ ] Habit tracking (create, complete, view streaks)
- [ ] Goal setting and progress tracking
- [ ] Financial snapshot and net worth tracking
- [ ] Dashboard with charts and progress indicators
- [ ] Weekly and monthly review views

### Future
- [ ] JWT authentication
- [ ] AI-powered insights and reflections
- [ ] Mobile-friendly responsive design
- [ ] External integrations (calendar, finance APIs)

---

## Development Notes

- The Vite dev server proxies all `/api` requests to the Express backend — no need to hardcode `localhost:5000` in frontend code
- MongoDB runs in Docker to keep the local environment clean, especially on WSL

---

## License

This project is for personal and portfolio use.
