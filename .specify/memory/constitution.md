<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0  [INITIAL RATIFICATION]
Modified principles: N/A (first version)
Added sections:
  - Core Principles (5 principles)
  - Technology Stack
  - Development Workflow
  - Governance
Templates updated:
  ✅ .specify/templates/plan-template.md — Constitution Check gates inferred from principles
  ✅ .specify/templates/spec-template.md — no structural changes required
  ✅ .specify/templates/tasks-template.md — no structural changes required
Follow-up TODOs:
  - None. All placeholders resolved from README, CLAUDE.md, and project context.
-->

# Mosaic Constitution

## Core Principles

### I. Microservices Independence

Each service (financial-service, medical-service, ideas-service, reminders-service) MUST be
independently deployable, independently testable, and own its own data schema. No service MUST
reach directly into another service's database. The api-gateway routes requests; it does NOT
contain business logic. Cross-service communication MUST go through documented REST contracts.

**Rationale**: The project is actively migrating from a Go monolith to polyglot microservices.
Preserving service boundaries from the start prevents re-coupling and ensures each team/language
can evolve independently.

### II. Polyglot by Domain

Each service MUST use the language best suited to its domain:
- API Gateway: Go
- Financial Service: Go
- Medical Service: PHP
- Ideas Service: C#
- Reminders Service: Node.js
- Processor: Python (LLM integration)
- Frontend: React/TypeScript

New services MUST justify language choice in their design doc. Language changes to existing
services require a constitution amendment.

**Rationale**: Polyglot architecture is an explicit architectural decision, not technical drift.
Enforcing it prevents accidental reversion to a single-language monolith.

### III. API-First Design

Every inter-service interface MUST be defined as a REST contract before implementation begins.
Contracts MUST live in `specs/[feature]/contracts/`. Breaking changes to any contract MUST
increment the endpoint version (e.g., `/v2/`) and maintain the prior version during a migration
window. The processor's `/process` endpoint is a first-class contract.

**Rationale**: The WebSocket broadcast and `/process` API are the project's central integration
points. Undocumented changes to these surfaces cause silent regressions.

### IV. Test Coverage at Boundaries

Integration tests are MANDATORY for:
- All service-to-service HTTP calls
- All database schema migrations
- The processor's LLM classification pipeline (via `pytest` in `processor/`)

Unit tests are OPTIONAL for internal helpers. Tests MUST NOT mock the database for migration
or schema validation scenarios — a real Postgres instance MUST be used. SQLite is acceptable
for unit-level CRUD tests only.

**Rationale**: Mock/prod divergence has caused silent failures in this project. Real-DB
integration tests are the authoritative correctness signal.

### V. Simplicity & Observability

Every service MUST expose a `GET /health` endpoint. Structured logging (JSON) is REQUIRED for
the api-gateway and all microservices. YAGNI applies to all features: implement the simplest
solution that satisfies the current spec. Abstractions MUST be justified by at least two
concrete use cases already present in the codebase, not anticipated ones.

**Rationale**: The processor currently lacks `/health`, making Docker health checks unreliable.
Structured logs are the minimum bar for on-call debugging in a multi-service setup.

## Technology Stack

The following stack is canonical and MUST NOT be replaced without a constitution amendment:

| Layer         | Technology                           |
|---------------|--------------------------------------|
| API Gateway   | Go 1.22+ / Gin / GORM                |
| Processor     | Python / FastAPI / Ollama            |
| Frontend      | React / Vite / TypeScript / Tailwind |
| Database      | PostgreSQL 16 (prod) / SQLite (dev)  |
| LLM Runtime   | Ollama (llama3.2)                    |
| Container     | Docker Compose                       |

PostgreSQL schemas MUST be separated per service in production. Migrations MUST be
version-controlled and applied via GORM AutoMigrate or equivalent per service.

## Development Workflow

1. All new features MUST follow the Spec Kit workflow: specify → clarify → plan → tasks → implement.
2. Feature branches MUST follow the naming convention: `[###-feature-name]` (e.g., `001-health-endpoints`).
3. A `GET /health` endpoint MUST be present and passing before a service PR is merged.
4. The Docker Compose stack MUST start cleanly (`docker compose up -d`) after every merged PR.
5. Frontend changes MUST be tested against the running dev server before marking complete.
6. The `processor/` MUST maintain a passing `pytest` suite; no merges that break existing tests.

## Governance

This constitution supersedes all other conventions documented in CLAUDE.md, README, or inline
comments when conflicts arise. Amendments require:
1. A pull request modifying `.specify/memory/constitution.md`
2. A version bump per semantic versioning rules (see version policy below)
3. Propagation of any changes to dependent templates under `.specify/templates/`

**Version policy**:
- MAJOR: Principle removal, redefinition, or service boundary change
- MINOR: New principle, section addition, or new mandatory technology
- PATCH: Clarifications, wording fixes, typo corrections

All PRs and reviews MUST verify compliance with Principles I–V before merge. Use
`CLAUDE.md` for runtime development guidance that supplements but does not override
this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-05-12 | **Last Amended**: 2026-05-12
