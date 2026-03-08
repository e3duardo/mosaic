# Mosaic

A personal assistant that categorizes natural language input into financial, medical, ideas, and reminders. Single input, multiple systems.

## Prerequisites

- **Docker** (or Colima)
- **Go 1.22+** and **Node 20+** (for local dev)

## Quick Start

### Option 1: Docker Compose (all-in-one)

Everything runs in Docker — no host Ollama needed.

```bash
docker compose up -d
```

**First run:** Pull an Ollama model (required before using the app):

```bash
docker compose exec ollama ollama pull llama3.2
```

- Frontend: http://localhost:5173 (Vite dev server with hot reload)
- API: http://localhost:8080
- Processor: http://localhost:8000
- PostgreSQL: localhost:5432 (user: mosaic, pass: mosaic, db: mosaic)

### Option 2: Local Development

```bash
# Terminal 1: Ollama
ollama serve && ollama pull llama3.2

# Terminal 2: Postgres (or use Docker)
docker run -d -p 5432:5432 -e POSTGRES_USER=mosaic -e POSTGRES_PASSWORD=mosaic -e POSTGRES_DB=mosaic postgres:16-alpine

# Terminal 3: Processor
cd processor && pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# Terminal 4: API
cd api && DATABASE_URL="postgres://mosaic:mosaic@localhost:5432/mosaic?sslmode=disable" go run ./cmd

# Terminal 5: Frontend
cd frontend && npm install && npm run dev
```

## Project Structure

```
mosaic/
├── api/              # Go - REST API, GORM, SQLite/PostgreSQL
├── processor/        # Python - FastAPI, Ollama, Pydantic
├── frontend/         # React - Vite, Tailwind, TanStack Query
└── docker-compose.yml
```

## Environment Variables

| Service   | Variable       | Default                          |
|-----------|----------------|----------------------------------|
| API       | DATABASE_URL   | mosaic.db (SQLite) or postgres://... |
| API       | PROCESSOR_URL  | http://localhost:8000            |
| Processor | OLLAMA_HOST    | http://localhost:11434           |
| Processor | OLLAMA_MODEL   | llama3.2                         |

## Features

- **Known medications**: Add medication names (e.g. Noex, Seretide) in the UI. Messages containing these words are classified as medical.
- **Reclassify**: Change a message's category via the dropdown. The system reverts previous artifacts and reprocesses with the new category.

## Examples (Portuguese)

- "Gastei 50 reais no tempero" → expense
- "Tomei um noex e um seretide" → medicine
- "Tomei um Noex agora" → medical (add "Noex" to known medications)
- "Tive uma ideia de criar xxx" → idea
