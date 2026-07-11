# TypeScript Migration - Complete

The JS-to-TS migration finished on 2026-07-10.
Every source file on both the server and the client is now TypeScript, both packages are native ESM, and all the temporary bridges from the gradual migration have been removed.
This document is now a record of the final toolchain plus the concepts the migration introduced.

---

## Final toolchain

### Server (`server/`)

| Tool / file            | Role                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| `tsx`                  | **Runs** TS in dev (`npm run dev` = `tsx watch src/server.ts`).         |
| `vitest`               | **Runs** the tests (`npm test`); transpiles TS itself, no loader hook.  |
| `tsc` + tsconfig.json  | **Type-checks** only (`npm run typecheck`); `noEmit` is on.             |
| tsconfig.build.json    | **Builds** for production (`npm run build` emits `dist/`).              |
| `node dist/server.js`  | **Production start** (`npm start`); no TS tooling at runtime.           |

Key idea: transpiling and type-checking are different jobs.
`tsx` and Vitest strip types without verifying them (a speed trade-off), so only `npm run typecheck` or `npm run build` actually validates types.
Run one of them before committing.

### Client (`client/`)

| Tool / file        | Role                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| Vite + esbuild     | Transpiles `.tsx` in dev and prod; never type-checks.                          |
| `tsc -b`           | Type-checks (`npm run typecheck`); also runs first in `npm run build`.         |
| tsconfig.json      | Solution-style root that references the two real configs below.                |
| tsconfig.app.json  | Browser code (`src/`): DOM libs, `jsx: react-jsx`, `moduleResolution: bundler`. |
| tsconfig.node.json | Node-side code (`vite.config.ts` only): no DOM libs.                           |

The split tsconfig exists because the app code and the Vite config run in different environments (browser vs Node) with different globals.
`tsc -b` (build mode) checks both via the project references in the root tsconfig.

---

## What changed in the final push (2026-07-10)

### Server

- Converted everything that was still JS: `app`, `db`, `server` (moved to `src/server.ts`), both controllers, both routes, `validateObjectId`, all four test files, and `vitest.config.ts`.
- Flipped to native ESM: `"type": "module"` in package.json, `module`/`moduleResolution: nodenext` in tsconfig, and explicit `.js` extensions on relative imports.
- Cleanup checklist items A and B from the old version of this doc are done: models now use `export default`, the shared interfaces moved to `src/types/models.ts`, `allowJs` was removed, and the `--import tsx` test hook is gone (`test` is plain `vitest run` again).
- Checklist item C is done: `npm run build` compiles through `tsconfig.build.json` into `dist/`, and `npm start` runs the compiled output with plain Node.
- ESLint now lints `.ts` via `typescript-eslint`; `nodemon` was removed (dead weight since `tsx watch` took over).

### Client

- All 21 `.jsx` files became `.tsx`, plus `tagColors.js` -> `.ts` and `vite.config.js` -> `.ts`.
- Added the three tsconfigs, `src/vite-env.d.ts` (types `import.meta.env.VITE_API_URL`), and `src/types.ts` with the shared API shapes (`Task`, `Habit`, `DueStatus`, `Urgency`, `TaskFilters`).
- Every component now declares a props interface; state, refs, and event handlers are typed.
- `npm run build` is now `tsc -b && vite build`, so a type error fails the build.
- ESLint config extended with `typescript-eslint` over `.ts`/`.tsx`.

### Repo root

- Root package.json cleaned up: stale `"main": "index.js"` removed, `"type": "module"` set.

---

## TS concepts introduced during the migration

- **Interfaces for wire data** (`client/src/types.ts`, `server/src/types/models.ts`): the same DB record has two shapes - on the server `_id` is an ObjectId and timestamps are `Date`s, but after JSON serialization the client sees plain strings.
  Each side declares the shape it actually handles.
- **String literal unions** (`type DueStatus = 'overdue' | 'today' | ...`): a value that can only be one of a fixed set of strings, so typos fail to compile.
- **`Record<K, V>`** (`borderColor: Record<Urgency, string>`): an object required to have an entry for every member of a union.
  Adding a new urgency without a color becomes a compile error.
- **`unknown` in catch blocks**: TS types caught errors as `unknown`, forcing a narrowing check (`err instanceof Error`) before reading `.message`.
  The server's duplicate-key check became a small type guard (`isDuplicateKeyError` in habitController).
- **Type guards and narrowing**: early returns like `if (!dueDate) return ...` narrow `string | null` to `string` for the rest of the function.
- **Non-null assertion `!`**: used only where we know more than the compiler (e.g. `document.getElementById('root')!`, or `.sort()` after a `.filter()` that guaranteed the field exists but which TS cannot see through).
- **Generic hooks and refs**: `useState<Task[]>([])` (bare `[]` would infer `never[]`), `useRef<HTMLInputElement>(null)`.
- **DOM vs React event types**: listeners attached to `document` receive DOM events (`MouseEvent`, `KeyboardEvent`); JSX handlers receive React synthetic events (`React.KeyboardEvent`).
  `e.target` is a loose `EventTarget` and needs an `as HTMLElement` / `as Node` assertion before element-only APIs.
- **`import type`**: type-only imports that are erased at compile time; plays well with `isolatedModules`, which keeps single-file transpilers like esbuild safe.
- **NodeNext resolution**: with ESM Node, relative imports need explicit extensions, and you write `./db.js` (the emitted name) even though the source is `db.ts`.
- **Project references / solution tsconfig** on the client: separate compilation environments for browser code and Node config files, checked together with `tsc -b`.

---

## Conventions going forward

- New code is TypeScript only; there is no `allowJs` escape hatch anymore.
- Server relative imports carry the `.js` extension (nodenext); client imports carry no extension (bundler resolution).
- Run `npm run typecheck` (both packages) and the server tests before committing; the client build also type-checks.
