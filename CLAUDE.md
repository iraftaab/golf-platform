# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-platform golf management/analytics platform. The monorepo contains:
- **backend/** — Spring Boot 3.2.5 REST API (Java 17, Maven)
- **frontend-admin/** — React 18 admin web UI (Create React App, port 3000)
- **mobile-app/** — Flutter cross-platform app (Dart)
- **ai-engine/** — Python FastAPI service for handicap/score analytics (port 8081)
- **infra/** — Docker Compose and Kubernetes manifests

## Commands

### Backend
```bash
# From project root or backend/
mvn spring-boot:run      # Run on port 8080 (H2 dev DB)
mvn clean install        # Build JAR
mvn test                 # Run tests
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm start                # Dev server on port 3000 (proxies /api → localhost:8080)
npm run build            # Production build
```

### AI Engine
```bash
cd ai-engine
pip install -r requirements.txt
python main.py           # FastAPI on port 8081, auto-reload
```

### Full Stack (Docker)
```bash
cd infra
docker compose up --build
```

## Backend Architecture

- **Package root:** `com.golf`
- **Layers:** `model` → `repository` (Spring Data JPA) → `service` → `controller`
- **Error handling:** `GlobalExceptionHandler` maps `NoSuchElementException` → 404, `IllegalArgumentException` → 400, `IllegalStateException` → 409, validation errors → 400
- **Database:** H2 in-memory for dev (`application.properties`); switch to PostgreSQL by overriding `SPRING_DATASOURCE_*` env vars
- **JPA DDL:** `ddl-auto=update` — schema auto-updated from entity classes
- **API docs:** Swagger UI at `http://localhost:8080/swagger-ui.html` (SpringDoc OpenAPI)
- **CORS:** `CorsConfig` allows `http://localhost:3000` on all `/api/**` routes

### Domain Model
| Entity | Key relationships |
|--------|------------------|
| `Player` | standalone; has handicap index |
| `Course` | has `List<Hole>` (cascade all) |
| `Hole` | belongs to `Course`; unique on (course, holeNumber) |
| `Round` | Player + Course + date; has `List<Score>`; status enum |
| `Score` | Round + Hole + strokes; unique on (round, hole) |
| `Booking` | Player + Course + teeTime; status enum |

### REST Endpoints
```
GET/POST        /api/players
GET/PUT/DELETE  /api/players/{id}
GET/POST        /api/courses           ?location= filter
GET/PUT/DELETE  /api/courses/{id}
GET             /api/players/{id}/rounds
GET/POST        /api/rounds
POST            /api/rounds/{id}/scores
POST            /api/rounds/{id}/complete
GET/POST        /api/bookings
POST            /api/bookings/{id}/cancel
DELETE          /api/bookings/{id}
GET             /api/bookings/player/{playerId}
GET             /api/bookings/course/{courseId}?date=
```

## AI Engine Architecture

FastAPI service exposing three groups of endpoints under `/ai/`:

- **`/ai/handicap/differential`** — Score Differential for one round
- **`/ai/handicap/index`** — Handicap Index from multiple rounds (WHS: best N of last 20)
- **`/ai/handicap/course`** — Convert Handicap Index → Course Handicap
- **`/ai/analysis/round`** — Per-round stats (eagles/birdies/pars, FIR%, GIR%, avg putts)
- **`/ai/analysis/trend`** — Rolling average scores
- **`/health`** — Liveness probe

Core logic lives in `handicap.py` and `score_analyzer.py` (pure Python, no DB dependency).

## Frontend Admin Architecture

Single-page React app with React Router v6. Routes: `/dashboard`, `/players`, `/courses`, `/bookings`. All API calls go through `src/services/api.js` (axios, baseURL `/api`, proxied to backend in dev).

## Infrastructure

- **`infra/docker-compose.yml`** — Postgres 16 + backend + ai-engine + frontend-admin
- **`infra/docker/`** — Dockerfiles for each service + nginx config for frontend
- **`infra/kubernetes/`** — Deployments, Services, and Ingress for backend, ai-engine, frontend-admin
- Production DB credentials must be supplied via a `db-secret` Kubernetes Secret
