#!/bin/bash

set -e

echo "🔍 Validating Kubernetes manifests..."

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed"
    exit 1
fi

MANIFEST_DIR="devops/k8s/manifests"

if [ ! -d "$MANIFEST_DIR" ]; then
    echo "❌ Manifests directory not found: $MANIFEST_DIR"
    exit 1
fi

echo "📁 Checking manifests in $MANIFEST_DIR"

for file in "$MANIFEST_DIR"/*.yaml; do
    if [ -f "$file" ]; then
        echo "✅ Validating $(basename "$file")"
        kubectl apply --dry-run=client -f "$file" > /dev/null
    fi
done

echo "🎉 All Kubernetes manifests are valid!"

echo "🔍 Validating Helm chart..."

HELM_CHART_DIR="devops/k8s/helm/devops-learning-platform"

if [ ! -d "$HELM_CHART_DIR" ]; then
    echo "❌ Helm chart directory not found: $HELM_CHART_DIR"
    exit 1
fi

if command -v helm &> /dev/null; then
    echo "✅ Validating Helm chart templates"
    helm template test "$HELM_CHART_DIR" > /dev/null
    echo "🎉 Helm chart is valid!"
else
    echo "⚠️  Helm is not installed, skipping Helm validation"
fi

echo "🔍 Validating Docker Compose..."

DOCKER_COMPOSE_FILE="devops/docker/docker-compose.yml"

if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    echo "❌ Docker Compose file not found: $DOCKER_COMPOSE_FILE"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo "✅ Validating Docker Compose configuration"
    docker-compose -f "$DOCKER_COMPOSE_FILE" config > /dev/null
    echo "🎉 Docker Compose configuration is valid!"
else
    echo "⚠️  Docker Compose is not installed, skipping validation"
fi

echo "✨ All validations completed successfully!"
