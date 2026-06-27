# TypeScript Migration — Status & Cleanup Checklist

This document tracks the in-progress migration of the codebase from JavaScript to
TypeScript. It exists so the temporary bridges and shortcuts we take during the
migration get removed at the end instead of quietly becoming permanent tech debt.

The migration is **gradual**: `.js` and `.ts` files coexist (enabled by
`allowJs` in `tsconfig.json`) and we convert one file at a time, keeping the test
suite green at every step.

---

## How the toolchain works

| Tool                  | Role                                                              |
| --------------------- | ---------------------------------------------------------------- |
| `tsx`                 | **Runs** TS — transpiles on the fly. Used by `dev`/`start`.      |
| `vitest`              | **Runs** the tests (transpiles TS via esbuild).                  |
| `tsc --noEmit`        | **Type-checks** the project. This is `npm run typecheck`.        |

Key idea: **transpiling and type-checking are different jobs.** `tsx` and Vitest
strip types and run the code _without verifying them_ (a speed trade-off). Only
`npm run typecheck` actually validates types. Run it before committing.

---

## Status

- [x] Server toolchain set up (`tsx`, `typescript`, `@types/node`, `tsconfig.json`)
- [x] `npm run typecheck` script added
- [x] `server/src/models/HabitLog.ts` converted
- [x] `server/src/models/Habit.ts` converted
- [ ] `server/src/models/Task.ts`
- [ ] Server `db.js`, `app.js`, `server.js`
- [ ] Server controllers, routes, middleware
- [ ] Server tests
- [ ] Client (`.jsx` → `.tsx`)

---

## Cleanup checklist (do these when the relevant milestone is reached)

### A. Once **all server source files** are `.ts`

- [ ] **Swap `export =` → `export default` in the models.** We use `export =`
      (CommonJS-style export) so the remaining `.js` files can `require()` the
      models without a `.default` unwrap. Once nothing uses `require` on them,
      `export default` is the cleaner, standard form. See `models/HabitLog.ts`.
- [ ] **Extract shared model interfaces.** The `IHabitLog` / `ITask` / `IHabit`
      interfaces currently live inside each model file and aren't exported
      (because `export =` can't coexist with other exports). Once controllers are
      TS and need these types, move them to a shared `src/types/` file and import
      them where needed.
- [ ] **Tighten `tsconfig.json`:** set `allowJs: false` (no more `.js` to allow)
      and consider turning on `checkJs`'s stricter cousins if desired.

### B. Once **source AND tests** are `.ts`

- [ ] **Remove the `--import tsx` hook from the `test` script.** It exists only to
      let `.js` files `require()` `.ts` files (Node's native loader doesn't know
      `.ts`). With everything on `.ts` + `import`, Vitest resolves `.ts` natively
      and the hook is dead weight. Revert `test` back to `vitest run`.
- [ ] Consider `@types/supertest` if Supertest's bundled types prove insufficient.

### C. Production build (do before any real deploy)

- [ ] **Add a real `tsc` build step.** `start` currently runs `tsx server.js`,
      which is fine for dev but not ideal for production. Add a `build` script
      (`tsc`, with `noEmit: false` + an `outDir: "dist"`), and change `start` to
      `node dist/server.js`. A separate `tsconfig.build.json` keeps build vs.
      type-check config clean.

### D. The ESM flip (optional milestone — see discussion notes below)

This is its own coherent step, best done **last**, once every file is `.ts`.

- [ ] Set `"type": "module"` in `server/package.json`.
- [ ] Switch `tsconfig` to ESM emit (`module`/`moduleResolution`: `nodenext`).
- [ ] Add explicit file extensions to relative imports (`./db.js`). `tsc` will
      flag every missing one for you.
- [ ] Replace any `__dirname`/`__filename` usage with `import.meta`-based
      equivalents (audit needed — may be none).
- [ ] This overlaps with the `export =` → `export default` swap in section A.

**Why last, not now:** flipping `"type": "module"` reinterprets _every remaining
`.js` file_ as ESM at once, breaking all their `require`/`module.exports`. Doing
it mid-migration would turn the gradual approach into a big-bang. Done at the end
(zero `.js` files left), it's a contained afternoon. Payoff: the server then
speaks the same module dialect as the client (already ESM via Vite).

### E. Unrelated cleanups noticed during the migration

- [ ] **Remove `nodemon` from server `devDependencies`** — replaced by
      `tsx watch` in the `dev` script, now unused.
- [ ] **Remove `axios` from client `dependencies`** — it's installed but never
      imported; the client uses native `fetch` everywhere.

---

## Design decisions (for context)

- **Hand-written interfaces over `InferSchemaType`.** Mongoose can infer a type
  from a schema, but we hand-write the interface so the act of declaring each
  field's type is explicit (better for learning, and the type is easy to read).
  Revisit only if the duplication becomes painful.
