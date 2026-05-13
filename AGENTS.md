# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Docker (recommended)
```bash
docker compose up -d
docker compose build
docker compose down

# Pull LLM model on first run
docker compose exec ollama ollama pull llama3.2
```

### Local development (each in a separate terminal)
```bash
# 1. Processor
cd processor && uvicorn main:app --reload --port 8000

# 2. API
cd api && DATABASE_URL=postgres://mosaic:mosaic@localhost:5432/mosaic?sslmode=disable go run ./cmd

# 3. Frontend
cd frontend && npm run dev

# 4. Postgres (if not using Docker)
docker run -d -p 5432:5432 -e POSTGRES_USER=mosaic -e POSTGRES_PASSWORD=mosaic -e POSTGRES_DB=mosaic postgres:16-alpine
```

### Frontend
```bash
cd frontend && npm run build   # tsc + vite build
```

### Processor tests
```bash
cd processor && pytest
```

## Architecture

```
frontend (React/Vite :5173)
    ↓ REST + WebSocket
api (Go/Gin :8080)
    ↓ POST /process
processor (Python/FastAPI :8000)
    ↓ ollama.chat()
ollama (:11434, model: llama3.2)

api ↔ postgres (:5432)
```

### Request flow

1. User submits text on the frontend (`POST /api/messages`)
2. `api` calls `POST /process` on the processor with `{message, history, known_medications, category_hint}`
3. Processor builds a system prompt from `categories.txt` and `examples.txt`, calls Ollama, and returns `{category, artifacts}`
4. `api` persists the message and its artifacts to Postgres, then broadcasts the updated message list over WebSocket
5. Frontend receives the broadcast and re-renders

### Key design decisions

- **Dual DB support**: `database.Open()` selects SQLite (default, file `mosaic.db`) or Postgres based on whether `DATABASE_URL` starts with `postgres://`. AutoMigrate runs on startup.
- **Artifacts**: each `Message` row stores processed entities as JSON in `artifacts_json`. Separate tables (`Expense`, `Earning`, `Medicine`, `Appointment`, `Idea`, `Reminder`) hold the structured records linked by `message_id`.
- **Reclassification**: `POST /api/messages/:id/reclassify` reverts previous artifacts and reprocesses with `category_hint`, which the processor uses to override LLM output.
- **Known medications**: the `Medication` table stores user-configured drug names. The api passes them to the processor on every call; the processor uses them to force `medical` classification even when the LLM misses it.
- **Configuration files** (`processor/app/categories.txt`, `examples.txt`, `accounts.txt`): read by the processor at runtime; `accounts.txt` is also synced to the api via `SyncFinancialFiles()` at startup.
- **WebSocket hub**: `api.NewHub()` manages connected clients; all writes broadcast the full message list.

### Go API structure

`api/internal/api` — handlers, hub, and route registration (referenced in `cmd/main.go` but source not yet committed; the checked-in `mosaic-api` binary is a macOS ARM64 build).
`api/internal/models` — GORM models for all entities.
`api/internal/database` — `Open()` factory.

### Frontend structure

All API calls go through `frontend/src/api/client.ts`. Routes: `/` (home, message input), `/reports/{financial,medicamentos,ideas,remember}`. Real-time updates via `useMessagesWebSocket` hook (`frontend/src/hooks/useMessagesWebSocket.ts`). `VITE_API_URL` sets the API base; when empty, requests are relative (Vite proxies to `VITE_PROXY_TARGET`).

## Environment variables

| Service   | Variable            | Default                                        |
|-----------|---------------------|------------------------------------------------|
| api       | `DATABASE_URL`      | `mosaic.db` (SQLite)                           |
| api       | `PROCESSOR_URL`     | `http://localhost:8000`                        |
| api       | `EXAMPLES_FILE`     | *(optional path to examples.txt)*              |
| api       | `CATEGORIES_FILE`   | *(optional path to categories.txt)*            |
| api       | `ACCOUNTS_FILE`     | *(optional path to accounts.txt)*              |
| processor | `OLLAMA_HOST`       | `http://localhost:11434`                       |
| processor | `OLLAMA_MODEL`      | `llama3.2`                                     |
| frontend  | `VITE_API_URL`      | *(empty — uses relative paths via Vite proxy)* |
| frontend  | `VITE_PROXY_TARGET` | `http://api:8080`                              |

## Próximos passos

O projeto está sendo migrado de um monólito Go para microsserviços. Arquitetura alvo:

```
frontend  →  api-gateway (Go)
                 ├── financial-service  (Go)
                 ├── medical-service    (PHP)
                 ├── ideas-service      (C#)
                 └── reminders-service  (Node.js)
                          ↑
                     processor (Python)
```

### Infraestrutura
- [ ] Documentar arquitetura de microsserviços no README
- [ ] Atualizar `docker-compose.yml` para todos os microsserviços
- [ ] Adicionar health check em todos os microsserviços no docker-compose
- [ ] PostgreSQL: criar schemas separados por serviço

### API Gateway (Go)
- [ ] Transformar o serviço `api` atual em API Gateway
- [ ] Adicionar endpoint `DELETE /api/messages/:id`
- [ ] Tratar timeout do processor com resposta de erro amigável

### Financial Service (Go)
- [ ] Criar estrutura base do `financial-service`
- [ ] Migrar endpoints financeiros do `api` para o `financial-service`
- [ ] Paginação nos endpoints `GET /financial/expenses` e `/earnings`

### Medical Service (PHP)
- [ ] Criar estrutura base do `medical-service`

### Ideas Service (C#)
- [ ] Criar estrutura base do `ideas-service`

### Reminders Service (Node.js)
- [ ] Criar estrutura base do `reminders-service`

### Processor (Python)
- [ ] Adicionar endpoint `GET /health`
- [ ] Mover carregamento de arquivos de configuração para o startup
- [ ] Escrever testes unitários para `ollama_client.py`

### Frontend (React/TypeScript)
- [ ] Reconexão automática do WebSocket quando a conexão cair (`frontend/src/hooks/useMessagesWebSocket.ts`)
- [ ] Skeleton de carregamento nas páginas de relatório
- [ ] Estado vazio quando não há dados nas páginas de relatório

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
