#!/bin/bash

set -e

echo "📊 Setting up monitoring stack..."

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed"
    exit 1
fi

echo "📁 Creating monitoring namespace..."
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

echo "🔍 Deploying Prometheus..."
kubectl apply -f devops/monitoring/prometheus/prometheus-config.yaml

echo "📈 Deploying Grafana..."
kubectl apply -f devops/monitoring/grafana/grafana-config.yaml

echo "🚨 Deploying Alertmanager..."
kubectl apply -f devops/monitoring/alertmanager/alertmanager-config.yaml

echo "⏳ Waiting for monitoring stack to be ready..."
kubectl wait --namespace monitoring \
  --for=condition=available deployment \
  --all \
  --timeout=300s

echo "✅ Monitoring stack deployed successfully!"

echo ""
echo "📊 Access monitoring tools:"
echo "  Prometheus: kubectl port-forward svc/prometheus-service 9090:9090 -n monitoring"
echo "  Grafana: kubectl port-forward svc/grafana 3000:3000 -n monitoring"
echo "  Alertmanager: kubectl port-forward svc/alertmanager 9093:9093 -n monitoring"
echo ""
echo "🔐 Default Grafana credentials: admin/admin123"
