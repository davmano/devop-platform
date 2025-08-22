#!/bin/bash

set -e

echo "🐳 Testing Docker builds..."

echo "🔧 Building backend Docker image..."
docker build -f devops/docker/Dockerfile.backend -t devops-backend:test .

echo "🔧 Building frontend Docker image..."
docker build -f devops/docker/Dockerfile.frontend -t devops-frontend:test .

echo "🔧 Testing Docker Compose configuration..."
cd devops/docker
docker-compose config

echo "✅ All Docker builds completed successfully!"

echo "🧹 Cleaning up test images..."
docker rmi devops-backend:test devops-frontend:test || true

echo "🎉 Docker build tests passed!"
