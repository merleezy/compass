# Compass Architecture & API Specifications

This document outlines key technical decisions, data models, and API routing schemas for Compass.

---

## Core Model — Habits vs. Tasks vs. Goals

To prevent feature creep and ensure clean database designs, Habits, Tasks, and Goals are separated by two independent axes:

### Axis 1: Recurrence (Determines the Section)

- **Habit:** _Recurring_, resets on a daily cadence.
- **Task:** _One-time_, done once (optionally with a due date).
- **Goal:** _Long-horizon_ target tracked over weeks/months (no daily reset).

### Axis 2: Measurement (Determines the UI/Logic)

- **Binary:** Simple toggle (done / not-done).
- **Progressive:** Accumulate progress up to a target (e.g. eat 150g protein).
- **Limit:** Stay under a ceiling threshold (e.g. under 2000 calories).

These axes are **orthogonal**. For example, "Drink water daily" is a _recurring, binary_ item (a Habit). "Make $10,000" is a _long-horizon, progressive_ item (a Goal).

---

## Key Decisions & Rationale

### MongoDB version pinned to `8.2.3`

CVE-2025-14847 (MongoBleed) is a high-severity memory leak affecting MongoDB versions 4.2–8.2. We pin our database container version to `8.2.3` to ensure we are running a patched instance, avoiding uncontrolled updates from `latest`.

### Separation of Habits and HabitLogs

To record daily completions, we use two separate collections: `Habits` (defines the habit metadata) and `HabitLogs` (tracks completion dates with `habitId` and `date`). This prevents the MongoDB anti-pattern of unbounded arrays growing inside a single document.

### Compound Unique Index on `HabitLog` `{ habitId, date }`

Enforces that a habit can only be logged once per day at the database layer. This prevents double-clicks or network retries from creating duplicate logs, returning a `409 Conflict` if violated.

### Invalid ObjectId Guard (`validateObjectId` middleware)

Every route with an `:id` param runs a shared `validateObjectId` middleware that checks `mongoose.isValidObjectId` before the controller. A malformed id (e.g. `/api/tasks/abc`) is a client error, so it returns `400` with a clear message — instead of letting Mongoose throw a `CastError` that the generic catch block would surface as a misleading `500`. Centralizing it as middleware keeps every controller free of repeated id checks.

### Timezone-Sensitive Local Resets

Instead of resetting daily habits at midnight UTC (which causes them to reset at 7:00 PM Central time for US developers), the browser extracts the local IANA timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) and passes it to the API. The server formats dates using the `en-CA` locale within that timezone to get the correct local `YYYY-MM-DD` date.

### Vite proxy for `/api` requests

All frontend calls are sent to `/api/*` and proxied to `http://localhost:5000` via `vite.config.js`. This eliminates the need to hardcode API URLs in our client code and mirrors how a production reverse proxy (like Nginx) works.

---

## API Router Reference

### Habits Endpoints

| Method     | Route                 | Purpose                                    |
| :--------- | :-------------------- | :----------------------------------------- |
| **GET**    | `/api/habits`         | Get all active habits                      |
| **POST**   | `/api/habits`         | Create a new habit                         |
| **GET**    | `/api/habits/today`   | Get habits with completion flags for today |
| **POST**   | `/api/habits/:id/log` | Mark a habit complete for today            |
| **DELETE** | `/api/habits/:id/log` | Unmark a habit (undo completion)           |
| **PUT**    | `/api/habits/:id`     | Edit habit name/description                |
| **DELETE** | `/api/habits/:id`     | Soft-delete a habit (preserves log history) |

> **Route Order Note:** `/today` is declared _before_ `/:id` in our Express router. Otherwise, Express treats the word "today" as a parameter ID and crashes.

### Tasks Endpoints

| Method     | Route                       | Purpose                                   |
| :--------- | :-------------------------- | :---------------------------------------- |
| **GET**    | `/api/tasks`                | Get all tasks (no active filter)          |
| **POST**   | `/api/tasks`                | Create a new task                         |
| **PATCH**  | `/api/tasks/:id`            | Edit task (title, description, due date, tags) |
| **PATCH**  | `/api/tasks/:id/complete`   | Complete a task (moves to completed list) |
| **PATCH**  | `/api/tasks/:id/uncomplete` | Mark a completed task active again        |
| **DELETE** | `/api/tasks/:id`            | Delete a task (hard delete)               |
