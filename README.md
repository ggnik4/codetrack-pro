# CodeTrack Pro

The unified dashboard for competitive programmers — Codeforces, LeetCode (and
later AtCoder/CodeChef/HackerRank), contests, goals, revision, and analytics
in one place.

> **Status:** Phase 2 of 20 (Authentication) complete. See `docs/architecture.md`
> for the full system design and rationale, and the phase list at the bottom
> of this file for what's built vs. pending.

## Auth endpoints (Phase 2)

All under `/api/v1/auth/`:

| Endpoint | Method | Purpose |
|---|---|---|
| `register/` | POST | Create account, sends verification email |
| `login/` | POST | Email+password login → `{access, refresh, user}` |
| `login/refresh/` | POST | Refresh an access token |
| `logout/` | POST | Blacklist a refresh token |
| `verify-email/` | POST | Consume `{uid, token}` from the emailed link |
| `verify-email/resend/` | POST | Resend verification (authenticated) |
| `password-reset/` | POST | Request a reset link by email |
| `password-reset/confirm/` | POST | Consume `{uid, token, new_password}` |
| `social/<google\|github>/` | POST | OAuth login (Google ID token / GitHub code) |
| `me/` | GET/PATCH | Current user's profile |

Google/GitHub OAuth need real client IDs/secrets in `backend/.env` — set
`GOOGLE_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_ID`, etc. In development, the
console email backend prints verification/reset links straight to the
`backend` container's logs instead of sending real email.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion, React Query, Zustand |
| Backend | Django 5, Django REST Framework, Celery, Celery Beat |
| Database | PostgreSQL |
| Cache / Broker | Redis |
| Auth | JWT (SimpleJWT) + Google/GitHub OAuth (django-allauth) |
| Deployment (target) | Frontend → Vercel · Backend → Railway/Render/AWS · Docker + GitHub Actions |

## Local development

### Prerequisites
- Docker + Docker Compose
- Node 20+ and Python 3.12+ if you want to run services outside Docker

### Quick start (Docker)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

This brings up Postgres, Redis, the Django API (`localhost:8000`), Celery
worker + beat, and the Next.js frontend (`localhost:3000`).

### Running services individually

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Celery** (separate terminals)
```bash
celery -A config worker -l info
celery -A config beat -l info
```

## API docs

Once the backend is running: `http://localhost:8000/api/docs/` (Swagger) or
`/api/redoc/` (Redoc), auto-generated from DRF via drf-spectacular.

## Project structure

See `docs/architecture.md` for the full repository layout and the reasoning
behind app boundaries, the provider-interface pattern for adding new
platforms, and the Celery scheduling design.

## Development phases

Built incrementally, one approved phase at a time:

- [x] 1. Project setup
- [x] **2. Authentication** — this phase
- [ ] 3. Database
- [ ] 4. User profiles
- [ ] 5. Codeforces integration
- [ ] 6. LeetCode integration
- [ ] 7. Dashboard
- [ ] 8. Contest tracking
- [ ] 9. Statistics
- [ ] 10. Graphs
- [ ] 11. Goals
- [ ] 12. Calendar
- [ ] 13. Friends
- [ ] 14. Recommendations
- [ ] 15. Hackathon tracker
- [ ] 16. Notifications
- [ ] 17. Settings
- [ ] 18. Optimization
- [ ] 19. Deployment
- [ ] 20. Testing
