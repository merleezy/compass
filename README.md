# Compass 🧭

A personal life dashboard for tracking habits, goals, reflections, and financial progress over time. Compass acts as a personal operating system to help you stay aligned with your long-term direction and make consistent daily progress.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB 8.2.3 (via Docker) |
| Charts | Recharts |
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

There are two separate `.env` files — one for Docker Compose and one for the Express server.

**Root `.env`** (used by Docker Compose):
```bash
cp .env.example .env
```
```
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_password_here
```

**`server/.env`** (used by Express):
```bash
cp server/.env.example server/.env
```
```
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
# Stop and remove the MongoDB container (data is safe — persisted in the Docker volume)
docker compose down

# Or, to pause without removing the container:
docker compose stop
```

---

## API Overview

All API endpoints are prefixed with `/api`.

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check if the server is running |

### Habits

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | Get all active habits |
| POST | `/api/habits` | Create a new habit |
| GET | `/api/habits/today` | Get all habits with today's completion status |
| POST | `/api/habits/:id/log` | Mark a habit complete for today |
| DELETE | `/api/habits/:id/log` | Undo today's completion for a habit |

---

## Roadmap

### MVP
- [x] Habit tracking — create and complete daily habits with progress bar
- [ ] Edit and delete habits
- [ ] Task list (simple, no calendar)
- [ ] Financial snapshot — net worth calculator and projection graph
- [ ] App shell — sidebar navigation and card-based layout

### V2
- [ ] Goal setting — milestone and metric-based goal types
- [ ] Calendar planner with weekly/monthly view
- [ ] Consistent styling pass across all pages

### V3
- [ ] Habit-driven goals — link habits to goals, derive progress from completion rate
- [ ] Historical cash flow tracking — log and visualize income/expenses over time
- [ ] Drag-and-drop reordering for habits and tasks

### Future
- [ ] JWT authentication
- [ ] AI-powered insights and reflections
- [ ] Mobile-friendly responsive design

---

## Development Notes

- The Vite dev server proxies all `/api` requests to the Express backend — no need to hardcode `localhost:5000` in frontend code
- MongoDB runs in Docker to keep the local environment clean, especially on WSL
- MongoDB is pinned to version 8.2.3 (patches CVE-2025-14847)

---

## License

This project is for personal and portfolio use.