# Incident Logs & Lessons Learned

This document serves as our knowledge base, tracking issues we encountered during development, how we resolved them, and the underlying engineering lessons.

---

## Tooling & Configuration

### ESM Import Syntax inside CommonJS Projects

- **The Issue:** When setting up ESLint on our backend (which uses `"type": "commonjs"`), running ESLint crashed Node with `SyntaxError: Cannot use import statement outside a module` when reading `eslint.config.js`.
- **The Resolution:** Renamed the configuration file to `eslint.config.mjs`.
- **The Lesson:** The `.mjs` extension stands for **Modular JavaScript**. It tells the Node.js runtime: _"Force-parse this specific file as an ES Module (allowing `import`/`export`), regardless of what `"type"` is declared in the directory's `package.json`."_

### Unused Caught Error Variables

- **The Issue:** Running `eslint` flagged `catch (_)` inside our timezone format function as an unused variable.
- **The Resolution:** Changed `catch (_)` to a bare `catch` block (removing the unused `_` variable binding).
- **The Lesson:** JavaScript (since ES2019) supports **Optional Catch Binding**. If you are silently falling back to a default value and don't need to read the properties of the error object inside the catch block, omit the variable parentheses entirely to write cleaner code and prevent linter warnings.

### Restoring Package Upgrades with Git

- **The Issue:** Fear that running `npm audit fix` would break our builds (a common issue).
- **The Resolution:** Audited the issues, recognized that we were dealing with transitive dependencies, and reviewed the Git commands to restore changes if anything went wrong.
- **The Lesson:**
  1.  Always use Git as your safety net before running package upgrades. If things break, `git checkout package.json package-lock.json` followed by `npm install` instantly rolls your dependencies back.
  2.  Never run `npm audit fix --force`. It forces major version upgrades which introduce breaking API changes. A standard `npm audit fix` stays within safe semver-compatible minor/patch releases.

### Prettier Code Formatting in VS Code

- **The Issue:** Saved files were not formatting automatically in VS Code.
- **The Resolution:** Added a `.prettierrc` configuration and workspace-level settings inside `.vscode/settings.json` specifying formatting rules, format-on-save activation, and Prettier as the default formatter.

---

### Backend API Logic

### Express Route Order Matches Parameter IDs

- **The Issue:** Defining `GET /api/habits/:id` before `GET /api/habits/today` caused requests for the today endpoint to fail because Express evaluated the literal string "today" as the `:id` parameter.
- **The Resolution:** Moved `/today` routes _above_ parameterized `/:id` routes in the route file.
- **The Lesson:** Express route match order is sequential. Dynamic parameters (like `:id` or `:name`) will match everything, so they must be declared at the bottom of the routing stack.

### HTTP Method Mismatch (POST vs. PATCH)

- **The Issue:** Backend routes listened for `POST /api/tasks/:id/complete` but the frontend sent a `PATCH` request, returning a `404 Not Found` error.
- **The Resolution:** Changed the Express router endpoints to use `.patch` to align with REST semantics and client requests.

---

### Frontend React Logic

### Double Reading the Response Stream

- **The Issue:** Frontend API calls returned `TypeError: body stream already read` errors.
- **The Resolution:** Restructured functions to evaluate `if (!res.ok)` first, throw the error text inside that condition, and read `res.json()` only once on a successful request.
- **The Lesson:** A browser's `Response` body is a readable stream. It can only be consumed once. Calling `res.json()` twice (once for debugging or error catching, once for state setting) is forbidden by the browser Fetch engine.

### Non-Standard Checkbox Rendering

- **The Issue:** Native browser checkboxes (`<input type="checkbox">`) rendered white backgrounds in dark mode, bypassing CSS styling overrides.
- **The Resolution:** Created a custom div-based Checkbox component in React that handles its own states via custom Tailwind classes.

### Local API Requests Hitting Production URLs

- **The Issue:** Local changes on the backend were not appearing in the frontend.
- **The Resolution:** Vite read environmental variables from `.env` (pointing to production) instead of `.env.local` (which holds local overrides). Added `.env.local` to override local URLs to `http://localhost:5000/api`.
