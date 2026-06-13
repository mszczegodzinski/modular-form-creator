# Modular Form Creator

Frontend for a **Resources Management** application. Users create resources, fill in modular forms (Basic Info and Project Details), complete resources when business rules are met, and review or edit saved data according to the backend contract.

The UI is built with **React**, **TypeScript**, **Vite**, **TanStack Query**, **React Router**, and **styled-components**. The backend is a separate Express + MongoDB service (included in this repo, not modified as part of the frontend assignment).

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm**
- **Docker** and **Docker Compose** (for the full stack or backend only)

## Quick start

### Full stack with Docker (recommended)

From the project root:

```bash
docker compose up --build
```

This starts:

- Frontend at `http://localhost:5173` (Vite dev server in a container)
- API at `http://localhost:5001`
- Swagger UI at `http://localhost:5001/docs`
- MongoDB on port `27017`

The frontend uses `VITE_API_URL=http://localhost:5001` so API calls from your browser reach the exposed backend port on the host. Backend CORS is configured for `http://localhost:5173`.

Run in the background:

```bash
docker compose up --build -d
```

Stop the stack:

```bash
docker compose down
```

See [backend/README.md](./backend/README.md) for full API documentation.

### Local frontend development

#### 1. Start the backend

```bash
docker compose up -d mongo backend
```

#### 2. Start the frontend on the host

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Optional environment file

Copy `.env.example` to `.env` when running the frontend locally outside Docker:

```bash
cp .env.example .env
```

The frontend reads `VITE_API_URL` (defaults to `http://localhost:5001`). See [src/api/config.ts](./src/api/config.ts).

## Available scripts

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start Vite dev server                      |
| `npm run build`     | Type-check and production build            |
| `npm run preview`   | Preview production build                   |
| `npm run lint`      | Run ESLint                                 |
| `npm run storybook` | Start design system Storybook on port 6006 |

## Application routes

| Route                                    | Page              | Description                                        |
| ---------------------------------------- | ----------------- | -------------------------------------------------- |
| `/resources`                             | Resources list    | Create and delete resources                        |
| `/resources/:resourceId`                 | Resource overview | Module progress, complete resource, submit changes |
| `/resources/:resourceId/details`         | Resource summary  | Read-only view of saved data from both modules     |
| `/resources/:resourceId/basic-info`      | Basic Info        | Owner, email, description, priority                |
| `/resources/:resourceId/project-details` | Project Details   | Project name, budget, category, team options       |

## Resource lifecycle

### Draft resources

1. **Create** a resource from the list page (name only).
2. Open the resource and complete **Basic Info** → **Save module** (`PATCH /basic-info`).
3. **Project Details** unlocks after Basic Info is complete on the server → **Save module** (`PATCH /project-details`).
4. When both modules are complete, use **Complete resource** on the overview (`PATCH /provisioning`) to move `draft` → `completed`.

Resource name is **immutable** after creation.

### Completed resources

- Module **PATCH** endpoints are disabled.
- Edits are kept in **frontend local state** (workspace buffer) while navigating between pages.
- Buffered changes are **lost on refresh** or when leaving the session.
- Persist all changes with **Submit changes** on the overview (`PUT /api/resources/:id`).
- The summary page shows **saved server data**; an info banner appears when unsaved module edits exist.

```text
draft
  ├─ PATCH basic-info
  ├─ PATCH project-details (after Basic Info complete)
  └─ PATCH provisioning → completed

completed
  ├─ edit modules locally (buffer)
  └─ PUT full resource (overview) → server updated, status stays completed
```

## Architecture overview

### Data fetching

- **TanStack Query** handles API calls and caching.
- Resource detail queries share one cache key per `resourceId` across overview, modules, and summary.
- Mutations update the cache after successful saves.

### Local workspace state

- `ResourceWorkspaceProvider` (under `/resources/:resourceId/*`) stores in-memory drafts for Basic Info and Project Details.
- Used for form editing and for detecting unsaved changes on completed resources.

### Notifications

- **notistack** snackbars report save/load/create errors and successful module saves.

### Project structure (frontend)

```text
src/
├── api/                 # Axios client, types, React Query hooks
├── components/          # App shell layout
├── design-system/       # Shared UI components (do not modify for assignment)
├── hooks/               # e.g. useAppSnackbar
├── pages/resources/     # Feature pages and workspace logic
├── providers/           # Query, snackbar providers
└── routes/              # Router and path helpers
```

## API reference

All endpoints and business rules are defined in [backend/README.md](./backend/README.md). The frontend uses:

- `GET/POST/DELETE /api/resources`
- `GET/PUT /api/resources/:id`
- `PATCH /api/resources/:id/basic-info`
- `PATCH /api/resources/:id/project-details`
- `PATCH /api/resources/:id/provisioning`

## Assignment context

Functional requirements and constraints are documented in [requirements.md](./requirements.md).

## Troubleshooting

| Issue                   | Check                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| API errors / empty list | Backend running? `docker compose ps`                                       |
| CORS errors             | Backend `CORS_ORIGIN` should include `http://localhost:5173`               |
| Stale data after save   | Mutations refresh query cache; try hard refresh if testing buffer behavior |

To reset all backend data during development:

```http
DELETE http://localhost:5001/api/admin/database
```

(See backend README for details.)
