# Compass Feature Plan & Roadmap

This document tracks the current state of Compass features and outlines our plans for V1 (MVP), V2, and V3.

---

## Current Build Status

- [x] Full-stack scaffold configured (React + Vite + Express + MongoDB)
- [x] Database authentication & volumes operational in Docker
- [x] Frontend-to-Backend Vite proxy setup (no CORS bugs in dev)
- [x] Habits model, controller, and route persistence complete
- [x] Habit UI cards (lists, create modal, streak badges, timezone resets)
- [x] Task model, controller, and routes persistent in database
- [x] Task UI cards (urgency grouping, 2.5s completion delays, tag + due-status filtering)
- [x] ESLint configured for both frontend and backend (Prettier via editor format-on-save)
- [x] Backend integration test suite (Vitest + Supertest, happy + sad paths)
- [x] Sub-dependency security audit checked (0 vulnerabilities)
- [x] TypeScript migration complete (server + client, native ESM) — see [typescript-migration.md](./typescript-migration.md)
- [x] GitHub Actions CI (typecheck, lint, test, build on every PR)

---

## The Roadmap

### Phase 1: MVP (In Progress)

#### Habits (Complete)

- Create, Read, Update, Delete (CRUD) persistence.
- Daily resets adjusted to local timezone.
- Hybrid streak tracking (3-state streak badge: active, safe, broken).
- Progress card shimmer animations.

#### Tasks (Complete)

- CRUD database persistence.
- Client-side urgency grouping (Overdue, Today, Upcoming, Completed).
- 2.5-second undo delay window.
- Urgency-colored left borders on cards.

#### Reflections (Next Up)

- Daily journal/reflection pages tracked by calendar date.
- Day rating slider (scale 1–10).
- Historical charts displaying rating scores over time.
- Weekly stats scorecard summarizing tasks completed, average scores, and habit check-ins.

---

### Phase 2: Goal Tracking & Planning (V2)

#### Goals Page

- **Milestone Goals:** Sub-task checklists where progress bar is derived from completed percentages.
- **Metric Goals:** Set target values (e.g. "Lose 20 lbs"), log updates, and graph the trend line over time.

#### Task Tagging & Metadata

- [x] Add custom tags (e.g., "Work", "Personal") to tasks.
- [x] Filter lists by active tags.
- [ ] Add task time estimates.

#### Weekly Calendar Planner

- Visual weekly calendar grid.
- Drag-and-drop tasks from an unscheduled sidebar onto calendar slots.

---

### Phase 3: Advanced Types & Finance (V3)

#### Progressive & Limit Habits

- **Progressive:** Increment numerical metrics towards a goal (e.g., drink 8 cups of water).
- **Limit:** Stay under a maximum threshold (e.g., limit caffeine intake).

#### Financial Planner

- **Net Worth Tracker:** Log asset and liability balances.
- **Cash Flow Forecaster:** Input recurring revenues and expenses to chart projected balances over 5–20 years using return rate sliders.
