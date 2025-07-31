.PHONY: help dev start stop restart logs build clean test shell status

# Default target
help:
	@echo "🚀 LavaGo API Development Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make dev      - Start development environment"
	@echo "  make start    - Start development environment"
	@echo "  make stop     - Stop development environment"
	@echo "  make restart  - Restart development environment"
	@echo "  make logs     - Show logs"
	@echo "  make build    - Rebuild Docker images"
	@echo "  make clean    - Clean up containers and images"
	@echo "  make test     - Run tests"
	@echo "  make shell    - Open shell in container"
	@echo "  make status   - Show container status"
	@echo "  make help     - Show this help message"

# Development commands
dev: start

start:
	@./scripts/dev.sh start

stop:
	@./scripts/dev.sh stop

restart:
	@./scripts/dev.sh restart

logs:
	@./scripts/dev.sh logs

build:
	@./scripts/dev.sh build

clean:
	@./scripts/dev.sh clean

test:
	@./scripts/dev.sh test

shell:
	@./scripts/dev.sh shell

status:
	@./scripts/dev.sh status 