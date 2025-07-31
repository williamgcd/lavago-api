# 🏠 Local Development with Docker

This guide will help you run the LavaGo API locally using Docker for a consistent development environment.

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docker.com) installed and running
- [Docker Compose](https://docs.docker.com/compose/) (usually included with Docker)

### Start Development Environment

```bash
# Start the development environment
make dev
# or
./scripts/dev.sh start
```

Your API will be available at:
- 🌐 **Main API**: http://localhost:3000
- 📊 **Health Check**: http://localhost:3000/health
- 🔧 **Test Config**: http://localhost:3000/test-config

## 📋 Available Commands

### Using Make (Recommended)
```bash
make help      # Show all available commands
make dev       # Start development environment
make start     # Start development environment
make stop      # Stop development environment
make restart   # Restart development environment
make logs      # Show logs
make build     # Rebuild Docker images
make clean     # Clean up containers and images
make test      # Run tests
make shell     # Open shell in container
make status    # Show container status
```

### Using Scripts Directly
```bash
./scripts/dev.sh start     # Start development environment
./scripts/dev.sh stop      # Stop development environment
./scripts/dev.sh restart   # Restart development environment
./scripts/dev.sh logs      # Show logs
./scripts/dev.sh build     # Rebuild Docker images
./scripts/dev.sh clean     # Clean up containers and images
./scripts/dev.sh test      # Run tests
./scripts/dev.sh shell     # Open shell in container
./scripts/dev.sh status    # Show container status
```

### Using Docker Compose Directly
```bash
docker-compose up -d       # Start in background
docker-compose up          # Start with logs
docker-compose down        # Stop containers
docker-compose logs -f     # Follow logs
docker-compose exec api bash  # Open shell in container
```

## 🔄 Hot Reloading

The development environment includes hot reloading! When you make changes to your code:

1. **File changes are automatically detected**
2. **Bun restarts the application**
3. **No manual restart needed**

## 🐛 Debugging

### View Logs
```bash
make logs
# or
docker-compose logs -f api
```

### Access Container Shell
```bash
make shell
# or
docker-compose exec api bash
```

### Check Container Status
```bash
make status
# or
docker-compose ps
```

## 🧪 Running Tests

```bash
make test
# or
docker-compose exec api bun test
```

## 🏗️ Rebuilding Images

If you need to rebuild the Docker images (e.g., after adding new dependencies):

```bash
make build
# or
docker-compose build --no-cache
```

## 🧹 Cleanup

To completely clean up the development environment:

```bash
make clean
# or
docker-compose down --rmi all --volumes --remove-orphans
```

## 🔧 Configuration

### Environment Variables
You can add environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=development
  - PORT=8080
  - DATABASE_URL=your-db-url
```

### Port Configuration
The API runs on port 8080 inside the container and is mapped to port 3000 on your host machine. You can change this in `docker-compose.yml`:

```yaml
ports:
  - "3000:8080"  # Change 3000 to your preferred port
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Kill the process or change the port in docker-compose.yml
   ```

2. **Docker not running**
   ```bash
   # Start Docker Desktop or Docker daemon
   # Then try again
   make start
   ```

3. **Permission issues**
   ```bash
   # Make sure the script is executable
   chmod +x scripts/dev.sh
   ```

4. **Container won't start**
   ```bash
   # Check logs for errors
   make logs
   # Rebuild if needed
   make build
   ```

### Useful Docker Commands

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove all unused volumes
docker volume prune

# Remove everything unused
docker system prune -a
```

## 📁 Project Structure

```
.
├── Dockerfile          # Production Docker image
├── Dockerfile.dev      # Development Docker image
├── docker-compose.yml  # Local development setup
├── scripts/
│   └── dev.sh         # Development management script
├── Makefile           # Convenient make commands
└── src/               # Your source code
```

## 🔗 Related Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Bun Documentation](https://bun.sh/docs)
- [Express.js Documentation](https://expressjs.com/) 