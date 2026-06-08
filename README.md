# Compass

A personal life dashboard for tracking habits, goals, reflections, and financial progress. Built as a portfolio project while learning full-stack development.

**Live demo:** https://compass-seven-psi.vercel.app/habits

![Habits Page](docs/demo-images/habits-page.png)

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React + Vite                        |
| Styling  | Tailwind CSS v4                     |
| Backend  | Node.js + Express                   |
| Database | MongoDB (Docker Local / Atlas Prod) |
| Charts   | Recharts                            |
| Icons    | Lucide React                        |

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (to run MongoDB locally)

### Setup

```bash
git clone https://github.com/merleezy/compass.git
cd compass

# Install dependencies
cd server && npm install
cd ../client && npm install
```

1. **Create the Root `.env`** (for Docker credentials):
   Create a `.env` file in the project root:

   ```env
   MONGO_ROOT_USERNAME=root
   MONGO_ROOT_PASSWORD=your_password_here
   ```

2. **Initialize & Start local MongoDB**:
   Ensure Docker is running, then run:

   ```bash
   docker volume create compass-mongo-data
   docker compose up -d
   ```

3. **Create `server/.env`**:
   Create a `.env` file inside the `server/` directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://root:your_password_here@localhost:27017/compass?authSource=admin
   ```

4. **Create `client/.env.local`** (for Vite):
   Create a `.env.local` file inside the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Start

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend: http://localhost:5173

---

## Features

- **Habit Tracking** — Create, complete, edit, and delete daily habits
- **Streak Counter** — 3-state streak badge (no streak / at-risk / maintained)
- **Progress Bar** — Visual daily completion progress
- **Responsive Design** — Collapsible sidebar, mobile-friendly drawer
- **Timezone-Aware Resets** — Habits reset at local midnight, not UTC

---

## Roadmap

- [x] Habit tracking with streaks
- [x] Responsive layout (mobile + desktop)
- [x] MongoDB Atlas + Vercel deployment
- [ ] Task list
- [ ] Daily reflections with rating history
- [ ] Goal tracking (milestone + metric types)
- [ ] Calendar planner

---

## License

Personal and portfolio use.
