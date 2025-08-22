#!/bin/bash

set -e

echo "🚀 Setting up DevOps Learning Platform locally..."

echo "🔍 Checking prerequisites..."

REQUIRED_TOOLS=("docker" "docker-compose" "kubectl" "helm")
MISSING_TOOLS=()

for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v "$tool" &> /dev/null; then
        MISSING_TOOLS+=("$tool")
    fi
done

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    echo "❌ Missing required tools: ${MISSING_TOOLS[*]}"
    echo "Please install the missing tools and try again."
    exit 1
fi

echo "✅ All required tools are installed"

echo "🌐 Setting up local DNS..."

HOSTS_ENTRIES=(
    "127.0.0.1 devops-learning.local"
    "127.0.0.1 api.devops-learning.local"
    "127.0.0.1 grafana.devops-learning.local"
    "127.0.0.1 prometheus.devops-learning.local"
    "127.0.0.1 argocd.devops-learning.local"
)

for entry in "${HOSTS_ENTRIES[@]}"; do
    if ! grep -q "$entry" /etc/hosts; then
        echo "Adding to /etc/hosts: $entry"
        echo "$entry" | sudo tee -a /etc/hosts > /dev/null
    else
        echo "Already in /etc/hosts: $entry"
    fi
done

echo "🐳 Building and starting Docker services..."

cd devops/docker
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🏥 Checking service health..."

BACKEND_URL="http://localhost:8000/healthz"
FRONTEND_URL="http://localhost:80"

if curl -f "$BACKEND_URL" > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    docker-compose logs backend
    exit 1
fi

if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    docker-compose logs frontend
    exit 1
fi

echo "🎉 Local setup completed successfully!"
echo ""
echo "📱 Access the application:"
echo "  Frontend: http://localhost:80"
echo "  Backend API: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "🛠️  Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Rebuild: docker-compose build --no-cache"
