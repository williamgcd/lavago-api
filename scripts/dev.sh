#!/bin/bash

# Development environment management script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo -e "${BLUE}🚀 LavaGo API Development Environment${NC}"
    echo ""
    echo "Usage: ./scripts/dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start the development environment"
    echo "  stop      - Stop the development environment"
    echo "  restart   - Restart the development environment"
    echo "  logs      - Show logs from the running containers"
    echo "  build     - Rebuild the Docker images"
    echo "  clean     - Stop containers and remove images"
    echo "  test      - Run tests in the container"
    echo "  shell     - Open a shell in the running container"
    echo "  status    - Show status of containers"
    echo ""
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    echo -e "${YELLOW}🚀 Starting development environment...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Development environment started!${NC}"
    echo -e "${BLUE}🌐 API available at: http://localhost:3000${NC}"
    echo -e "${BLUE}📊 Health check: http://localhost:3000/health${NC}"
    echo -e "${BLUE}🔧 Test config: http://localhost:3000/test-config${NC}"
}

# Function to stop development environment
stop_dev() {
    echo -e "${YELLOW}🛑 Stopping development environment...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Development environment stopped!${NC}"
}

# Function to restart development environment
restart_dev() {
    echo -e "${YELLOW}🔄 Restarting development environment...${NC}"
    docker-compose down
    docker-compose up -d
    echo -e "${GREEN}✅ Development environment restarted!${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${YELLOW}📋 Showing logs...${NC}"
    docker-compose logs -f api
}

# Function to rebuild images
rebuild_images() {
    echo -e "${YELLOW}🏗️ Rebuilding Docker images...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Images rebuilt!${NC}"
}

# Function to clean up
clean_up() {
    echo -e "${YELLOW}🧹 Cleaning up development environment...${NC}"
    docker-compose down --rmi all --volumes --remove-orphans
    echo -e "${GREEN}✅ Cleanup complete!${NC}"
}

# Function to run tests
run_tests() {
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    docker-compose exec api bun test
}

# Function to open shell
open_shell() {
    echo -e "${YELLOW}🐚 Opening shell in container...${NC}"
    docker-compose exec api /bin/bash
}

# Function to show status
show_status() {
    echo -e "${YELLOW}📊 Container status:${NC}"
    docker-compose ps
}

# Main script logic
case "$1" in
    start)
        check_docker
        start_dev
        ;;
    stop)
        check_docker
        stop_dev
        ;;
    restart)
        check_docker
        restart_dev
        ;;
    logs)
        check_docker
        show_logs
        ;;
    build)
        check_docker
        rebuild_images
        ;;
    clean)
        check_docker
        clean_up
        ;;
    test)
        check_docker
        run_tests
        ;;
    shell)
        check_docker
        open_shell
        ;;
    status)
        check_docker
        show_status
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 