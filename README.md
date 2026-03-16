# Golf Platform

Multi-platform golf management and analytics platform.

## Services

| Service | Stack | Port |
|---|---|---|
| Backend API | Spring Boot 3.2 · Java 17 · H2/PostgreSQL | 8080 |
| Admin UI | React 18 · React Router | 3000 |
| AI Engine | Python · FastAPI | 8081 |
| Mobile App | Flutter · Dart | — |

## Quick Start

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm start
```

### AI Engine
```bash
cd ai-engine
pip install -r requirements.txt
python main.py
```

### Full Stack (Docker)
```bash
cd infra
docker compose up --build
```

## API Docs

- REST API: http://localhost:8080/swagger-ui.html
- AI Engine: http://localhost:8081/docs

## Domain Model

- **Player** — golfer profile with handicap index
- **Course** — golf course with holes (par, yardage, stroke index)
- **Round** — a player's round at a course with per-hole scores
- **Booking** — tee time reservation for a player at a course
