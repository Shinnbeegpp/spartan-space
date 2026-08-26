# AGENTS.md

Persistent instructions for AI coding agents working in this repository.

## Repository Overview

SpartanSpaces is currently a JavaScript monorepo-style project with separate backend and frontend folders:

- `backend/`: Express.js API using CommonJS modules.
- `frontend/`: Vite + React app using ES modules.
- `backend/database/schema.sql`: current MySQL schema.
- Root `package.json`: currently contains general backend-oriented dependencies but no runnable project scripts beyond the placeholder test script.

Do not assume the full product architecture is already implemented. The current codebase contains early authentication/admin flows plus a minimal React UI.

## Current Implemented Architecture

### Backend

- Entry point: `backend/server.js`.
- Database pool: `backend/config/db.js`, using `mysql2/promise` and environment variables:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `PORT`
  - `JWT_SECRET`
  - `GOOGLE_CLIENT_ID`
- Route modules:
  - `backend/routes/authRoutes.js` mounted at `/api/auth`.
  - `backend/routes/adminRoutes.js` mounted at `/api/admin`.
- Controllers:
  - `backend/controllers/authController.js`
  - `backend/controllers/adminController.js`
- Middleware:
  - `backend/middleware/authMiddleware.js`

Authentication currently uses JWT bearer tokens in the `Authorization` header. Tokens are signed with `{ id, role }` and a `1d` expiry. The frontend currently stores returned tokens in `localStorage`.

Student login is implemented through Google ID token verification with `google-auth-library`. The current accepted domains are:

- `@g.batstate-u.edu.ph`
- `@sr.batstate-u.edu.ph`

New student records are inserted into `Users` with `role = 'student'` and `is_verified = true`.

Landlord registration currently accepts only `email` and `password`, hashes the password with `bcrypt`, and inserts `role = 'landlord'` with `is_verified = false`. The broader landlord profile fields and verification-document upload are planned but not implemented yet.

Admin routes are protected by `protect` and `adminOnly`. `adminOnly` requires `req.user.role === 'admin'`, but the current SQL schema only defines `Users.role` as `ENUM('student', 'landlord')`. Fix this mismatch before relying on admin login flows.

### Database

The current schema only creates:

- `Users`
  - `id`
  - `email`
  - `password`
  - `role ENUM('student', 'landlord')`
  - `is_verified`

The intended product schema includes `Properties`, `Units`, `Applications`, `Leases`, and `Maintenance_Tickets`, but those tables are not currently present. Add migrations/schema changes before building features that depend on them.

### Frontend

- Entry point: `frontend/src/main.jsx`.
- Router setup: `frontend/src/App.jsx`.
- Current routes:
  - `/` -> `frontend/src/pages/StudentHome.jsx`
  - `/landlord` -> `frontend/src/pages/landlordAuth.jsx`
  - `/admin` -> `frontend/src/pages/AdminDashboard.jsx`
- Global styling: `frontend/src/index.css`.
- Vite config: `frontend/vite.config.js`.
- ESLint config: `frontend/eslint.config.js`.

The frontend currently calls the backend directly at `http://localhost:5000`. If this changes, update all affected calls consistently or introduce a small shared API helper.

`frontend/src/main.jsx` currently hardcodes the Google OAuth client ID. Prefer moving credentials/configuration into environment variables before production use.

## Product Direction To Preserve

When expanding the system, preserve this target architecture unless the user explicitly changes it.

### Authentication and RBAC

- Students authenticate with institutional Google SSO.
- The backend must enforce BatStateU student email domain restrictions.
- Verified students should be auto-created with `role = 'student'` and `is_verified = true`.
- Landlords use form registration with password hashing.
- Landlords should remain `is_verified = false` until an admin approves submitted identity/business documents.
- JWTs should represent at least `user_id` or current `id`, `role`, and verification state when routes need it.
- Every protected API route should validate JWTs and enforce role access in Express middleware.
- A student attempting to access landlord-only routes should receive `403 Forbidden`.

### Landlord Portal

Future landlord features should follow a `Property -> Unit` hierarchy:

- Properties: name, address, description, amenities, rules, landlord owner, and map coordinates.
- Units: room name, target gender, capacity, monthly rate, and photos.
- Applications: incoming student requests with statuses such as `Pending`, `Interview Scheduled`, `Approved`, and `Rejected`.
- Occupancy: active leases should drive available-slot calculations. Full units should be unlisted or unavailable.
- Maintenance: landlords should manage tenant tickets through statuses such as `Pending`, `In Progress`, and `Resolved`.

### Student/Tenant Experience

Future student features should include:

- Public dorm marketplace with search, filters, cards, availability, gender badges, and general location.
- Dorm detail pages with photo carousel, map pin, Google Maps directions, landlord contact options, and application flow.
- A dynamic "My Dorm" dashboard unlocked by an active lease.
- Tenant maintenance issue submission and ticket status tracking.

### Intended Relational Model

Use the current database as the source of truth, but align future schema work with this conceptual model:

- `Users` owns student, landlord, and eventually admin accounts.
- `Properties` belongs to a landlord.
- `Units` belongs to a property.
- `Applications` links students to properties before onboarding.
- `Leases` links students to units after onboarding.
- `Maintenance_Tickets` links tenant-reported issues to students and units.

## Development Commands

Backend:

```sh
cd backend
npm start
```

Frontend:

```sh
cd frontend
npm run dev
npm run build
npm run lint
```

There are no meaningful automated tests configured yet. The root and backend `test` scripts are placeholders that intentionally fail.

## Coding Guidelines

- Keep backend modules CommonJS unless converting the backend intentionally and consistently.
- Keep frontend modules as ES modules.
- Prefer parameterized MySQL queries using `?` placeholders.
- Do not commit secrets or machine-specific `.env` files.
- Keep route authorization checks on the server. Frontend checks are only UX helpers.
- Keep changes scoped to the requested feature or bug.
- Avoid broad refactors while implementing missing marketplace, property, lease, or maintenance features.
- Preserve existing user changes in the worktree. This repository may already contain uncommitted edits.
- Update `backend/database/schema.sql` when adding tables or columns required by code.
- If adding new protected routes, add middleware that checks both authentication and the correct role.
- If changing token payload shape, update all frontend token consumers and backend middleware together.

## Current Gaps Agents Should Notice

- `backend/server.js` defines `/api/health` twice.
- `backend/middleware/authMiddleware.js` exports the same object twice.
- `adminOnly` expects an `admin` role, but the current `Users.role` enum does not include `admin`.
- `authController.js` contains duplicate admin helper functions that are not exported from that file.
- Landlord registration does not yet collect first name, last name, mobile number, or verification documents.
- JWT payloads do not currently include `is_verified`.
- Session persistence currently uses `localStorage`, not HttpOnly cookies.
- The marketplace, property/unit management, leases, maintenance tickets, maps, uploads, and application workflows are not implemented yet.
