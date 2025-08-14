#!/bin/bash

# Test Docker build and run script
# This script tests the Docker container locally

set -e

echo "🧪 Testing Docker build and run..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build the image
echo "🔨 Building Docker image..."
docker build -t lavago-api-test .

# Run the container in background
echo "🚀 Starting container..."
CONTAINER_ID=$(docker run -d -p 3000:3000 \
  -e NODE_ENV=development \
  -e PORT=3000 \
  -e BASE_URL=http://localhost:3000 \
  -e APP_BASE=http://localhost:3000 \
  -e APP_NAME="LAVAGO API" \
  -e JWT_SECRET=test-jwt-secret \
  -e JWT_LENGTH=10d \
  -e TOKEN=test-token \
  lavago-api-test)

echo "📦 Container ID: $CONTAINER_ID"

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Test the health endpoint
echo "🏥 Testing health endpoint..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    echo "📊 Health response:"
    curl -s http://localhost:3000/health | jq . 2>/dev/null || curl -s http://localhost:3000/health
else
    echo "❌ Health check failed!"
    echo "📋 Container logs:"
    docker logs $CONTAINER_ID
    exit 1
fi

# Test the root endpoint
echo "🏠 Testing root endpoint..."
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Root endpoint working!"
    echo "📄 Root response:"
    curl -s http://localhost:3000/
else
    echo "❌ Root endpoint failed!"
fi

# Stop and remove the container
echo "🧹 Cleaning up..."
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID

echo "✅ Docker test completed successfully!"

