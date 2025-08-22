#!/bin/bash

set -e

echo "🚀 Deploying DevOps Learning Platform to EKS..."

CLUSTER_NAME="devops-learning-cluster"
REGION="us-west-2"
NAMESPACE="devops-learning-platform"

echo "🔍 Checking prerequisites..."

REQUIRED_TOOLS=("kubectl" "helm" "aws")
MISSING_TOOLS=()

for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v "$tool" &> /dev/null; then
        MISSING_TOOLS+=("$tool")
    fi
done

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    echo "❌ Missing required tools: ${MISSING_TOOLS[*]}"
    exit 1
fi

echo "🔐 Checking AWS authentication..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS authentication failed. Please configure AWS CLI."
    exit 1
fi

echo "✅ AWS authentication successful"

echo "⚙️  Updating kubeconfig..."
aws eks update-kubeconfig --region "$REGION" --name "$CLUSTER_NAME"

echo "🔗 Checking cluster connectivity..."
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "❌ Cannot connect to EKS cluster"
    exit 1
fi

echo "✅ Connected to EKS cluster"

echo "📦 Adding Helm repositories..."
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

echo "🌐 Installing NGINX Ingress Controller..."
kubectl apply -f devops/ingress/nginx-ingress-controller.yaml

echo "⏳ Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

echo "🔒 Installing cert-manager..."
kubectl apply -f devops/ingress/cert-manager.yaml

echo "⏳ Waiting for cert-manager to be ready..."
kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=cert-manager \
  --timeout=300s

echo "🚀 Deploying application..."
helm upgrade --install devops-learning-platform \
  devops/k8s/helm/devops-learning-platform/ \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --wait \
  --timeout=600s

echo "📊 Deploying monitoring stack..."
kubectl apply -f devops/monitoring/prometheus/prometheus-config.yaml
kubectl apply -f devops/monitoring/grafana/grafana-config.yaml

echo "⏳ Waiting for deployments to be ready..."
kubectl wait --namespace "$NAMESPACE" \
  --for=condition=available deployment \
  --all \
  --timeout=600s

echo "📋 Getting service information..."
kubectl get services -n "$NAMESPACE"
kubectl get ingress -n "$NAMESPACE"

echo "🌐 Getting LoadBalancer IP..."
LB_IP=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

if [ -n "$LB_IP" ]; then
    echo "✅ LoadBalancer hostname: $LB_IP"
    echo ""
    echo "📝 Update your DNS records:"
    echo "  devops-learning.yourdomain.com -> $LB_IP"
else
    echo "⏳ LoadBalancer IP not yet available. Check again in a few minutes:"
    echo "  kubectl get svc ingress-nginx-controller -n ingress-nginx"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Access the application:"
echo "  Application: https://devops-learning.local (after DNS setup)"
echo "  Prometheus: kubectl port-forward svc/prometheus-service 9090:9090 -n monitoring"
echo "  Grafana: kubectl port-forward svc/grafana 3000:3000 -n monitoring"
echo ""
echo "🛠️  Useful commands:"
echo "  Check pods: kubectl get pods -n $NAMESPACE"
echo "  View logs: kubectl logs -f deployment/devops-backend -n $NAMESPACE"
echo "  Scale app: kubectl scale deployment devops-backend --replicas=5 -n $NAMESPACE"
