# Compass — Project Context

## Project Summary

Compass is a personal life dashboard for tracking habits, goals, tasks, and reflections. It is being built by Isaac, a recent CS graduate, for both personal use and as a portfolio project while learning full-stack development.

---

## Technical Stack Overview

| Layer    | Technology                 |
| -------- | -------------------------- |
| Frontend | React + Vite               |
| Backend  | Node.js + Express          |
| Database | MongoDB 8.2.3 (via Docker) |
| Styling  | Tailwind CSS v4            |
| Charts   | Recharts                   |
| Routing  | React Router DOM           |
| Icons    | Lucide React               |
| Testing  | Vitest + Supertest         |

---

## Documentation Map

To make the codebase maintainable and production-ready, our detailed project specifications are split into the following sub-documents:

- **[Local Development Setup Guide](file:///home/isaac/Code/compass/docs/running-locally.md)**
  - Prerequisites, environment variables setup, project tree structure, and instructions to run.
- **[Architecture & API Reference](file:///home/isaac/Code/compass/docs/architecture.md)**
  - Database models rationale, the Habits vs. Tasks vs. Goals measurement axis, and active Express API endpoints.
- **[Design System & UI Components](file:///home/isaac/Code/compass/docs/design-system.md)**
  - Active typography, Tailwind v4 theme color tokens, custom component patterns, and visual animations.
- **[Product Roadmap & Status](file:///home/isaac/Code/compass/docs/roadmap.md)**
  - Status checklist of built features, planned MVP pages, and designs for V2 and V3.
- **[Lessons Learned & Incidents Logs](file:///home/isaac/Code/compass/docs/lessons-learned.md)**
  - Development bugs squashed, ESM configurations, optional catch bindings, and browser engine gotchas.
- **[Production Readiness Guide](file:///home/isaac/Code/compass/docs/production-readiness.md)**
  - Standards and checklists for backend reliability, security hardening, database indexing, testing suites, and devops processes.
- **[TypeScript Migration — Complete](file:///home/isaac/Code/compass/docs/typescript-migration.md)**
  - The JS→TS migration finished 2026-07-10 (full codebase on TS + ESM). Documents the final toolchain, what changed, and the TS concepts introduced.

---

## Assistant Behavior

All agent behavior — mentoring style, working modes, code standards, and efficiency rules — is defined in **`AGENTS.md`** (the single source of truth; don't duplicate it here). This file is for project *state* only.

Environment specifics worth knowing: Isaac develops in WSL (Ubuntu) using VS Code (with the MongoDB extension), running frontend, backend, and Docker in separate terminals.

---

## Known Stubs & Deferred UI

These elements exist in the UI but have no functionality yet — do not treat them as bugs:

- **Top bar avatar** is a hardcoded "I" initial in a rounded square. No auth system exists yet.
- **Reflections, Goals, Settings pages** are empty stubs — navigation works but no content is rendered.
- **Dashboard (HomePage)** shows a placeholder subtitle. No widgets yet.
