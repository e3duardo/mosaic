.PHONY: build docker-build docker-up docker-down dev

# Local development
dev:
	@echo "Run in separate terminals:"
	@echo "  1. ollama serve && ollama pull llama3.2"
	@echo "  2. docker run -d -p 5432:5432 -e POSTGRES_USER=mosaic -e POSTGRES_PASSWORD=mosaic -e POSTGRES_DB=mosaic postgres:16-alpine"
	@echo "  3. cd processor && uvicorn main:app --reload"
	@echo "  4. cd api && DATABASE_URL=postgres://mosaic:mosaic@localhost:5432/mosaic?sslmode=disable go run ./cmd"
	@echo "  5. cd frontend && npm run dev"

# Docker
docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down
