# DevOps Implementation Plan for Learning Platform

## 📋 Overview

This plan provides step-by-step instructions to implement comprehensive DevOps practices for the DevOps Learning Platform, including containerization, CI/CD, Kubernetes deployment, monitoring, and GitOps.

## 🎯 Implementation Goals

- **Multi-stage Docker builds** for optimized container images
- **Docker Compose** for local development environment
- **Kubernetes manifests** for EKS deployment
- **GitHub Actions CI** pipeline with testing and security scanning
- **ArgoCD CD** for GitOps-based deployment
- **Helm charts** for templated deployments
- **Ingress controller** with AWS Load Balancer
- **Local DNS mapping** for testing
- **Prometheus & Grafana** monitoring stack

## 🚀 Phase 1: Containerization

### Step 1.1: Create Multi-Stage Dockerfiles

#### Backend Dockerfile (`devops/docker/Dockerfile.backend`)
```dockerfile
# Build stage
FROM python:3.12-slim as builder
WORKDIR /app
RUN pip install poetry
COPY devops-backend/pyproject.toml devops-backend/poetry.lock ./
RUN poetry config virtualenvs.create false && poetry install --no-dev

# Production stage
FROM python:3.12-slim
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY devops-backend/app ./app
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile (`devops/docker/Dockerfile.frontend`)
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY devops-frontend/package*.json ./
RUN npm ci --only=production
COPY devops-frontend/ .
RUN npm run build

# Production stage
FROM nginx:alpine
RUN addgroup -g 101 -S nginx && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY devops/docker/nginx.conf /etc/nginx/nginx.conf
USER nginx
EXPOSE 80
```

### Step 1.2: Create Docker Compose Configuration

#### Docker Compose (`devops/docker/docker-compose.yml`)
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ../..
      dockerfile: devops/docker/Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=development
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ../..
      dockerfile: devops/docker/Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000
```

### Step 1.3: Test Local Setup

```bash
# Build and run containers
cd devops/docker
docker-compose up --build

# Test endpoints
curl http://localhost:8000/healthz
curl http://localhost:80
```

## ☸️ Phase 2: Kubernetes Deployment

### Step 2.1: Create Kubernetes Manifests

#### Namespace (`devops/k8s/manifests/namespace.yaml`)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: devops-learning-platform
  labels:
    name: devops-learning-platform
```

#### ConfigMap (`devops/k8s/manifests/configmap.yaml`)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: devops-app-config
  namespace: devops-learning-platform
data:
  ENVIRONMENT: "production"
  VITE_API_URL: "http://devops-backend-service:8000"
  METRICS_ENABLED: "true"
```

#### Backend Deployment (`devops/k8s/manifests/backend-deployment.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devops-backend
  namespace: devops-learning-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devops-backend
  template:
    metadata:
      labels:
        app: devops-backend
    spec:
      containers:
      - name: backend
        image: devops-backend:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: devops-app-config
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Services (`devops/k8s/manifests/services.yaml`)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: devops-backend-service
  namespace: devops-learning-platform
spec:
  selector:
    app: devops-backend
  ports:
  - port: 8000
    targetPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: devops-frontend-service
  namespace: devops-learning-platform
spec:
  selector:
    app: devops-frontend
  ports:
  - port: 80
    targetPort: 80
```

#### HPA (`devops/k8s/manifests/hpa.yaml`)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: devops-backend-hpa
  namespace: devops-learning-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: devops-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Step 2.2: Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f devops/k8s/manifests/

# Check deployment status
kubectl get pods -n devops-learning-platform
kubectl get services -n devops-learning-platform
```

## 🚀 Phase 3: CI/CD Pipeline

### Step 3.1: GitHub Actions CI Pipeline

#### CI Workflow (`.github/workflows/ci.yml`)
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.12'
    
    - name: Install dependencies
      run: |
        cd devops-backend
        pip install poetry
        poetry install
    
    - name: Run tests
      run: |
        cd devops-backend
        poetry run pytest
    
    - name: Run security scan
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: 'devops-backend/'

  test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd devops-frontend
        npm ci
    
    - name: Run tests
      run: |
        cd devops-frontend
        npm test
    
    - name: Build application
      run: |
        cd devops-frontend
        npm run build

  build-and-push:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ secrets.REGISTRY_URL }}
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - name: Build and push backend
      uses: docker/build-push-action@v5
      with:
        context: .
        file: devops/docker/Dockerfile.backend
        push: true
        tags: ${{ secrets.REGISTRY_URL }}/devops-backend:${{ github.sha }}
    
    - name: Build and push frontend
      uses: docker/build-push-action@v5
      with:
        context: .
        file: devops/docker/Dockerfile.frontend
        push: true
        tags: ${{ secrets.REGISTRY_URL }}/devops-frontend:${{ github.sha }}
```

### Step 3.2: ArgoCD Configuration

#### ArgoCD Application (`devops/ci-cd/argocd/application.yaml`)
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: devops-learning-platform
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/davmano/devops-learning-app
    targetRevision: main
    path: devops/k8s/manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: devops-learning-platform
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

## 📦 Phase 4: Helm Charts

### Step 4.1: Create Helm Chart Structure

```bash
# Create Helm chart
helm create devops-learning-platform
cd devops/k8s/helm/devops-learning-platform/
```

#### Chart.yaml
```yaml
apiVersion: v2
name: devops-learning-platform
description: A Helm chart for DevOps Learning Platform
type: application
version: 0.1.0
appVersion: "1.0.0"
```

#### values.yaml
```yaml
backend:
  image:
    repository: devops-backend
    tag: latest
  replicaCount: 3
  resources:
    requests:
      memory: "256Mi"
      cpu: "250m"
    limits:
      memory: "512Mi"
      cpu: "500m"

frontend:
  image:
    repository: devops-frontend
    tag: latest
  replicaCount: 2
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"
    limits:
      memory: "256Mi"
      cpu: "200m"

ingress:
  enabled: true
  host: devops-learning.local
  tls:
    enabled: true
```

### Step 4.2: Deploy with Helm

```bash
# Install the application
helm install devops-learning-platform ./devops/k8s/helm/devops-learning-platform/ \
  --namespace devops-learning-platform \
  --create-namespace

# Upgrade deployment
helm upgrade devops-learning-platform ./devops/k8s/helm/devops-learning-platform/
```

## 🌐 Phase 5: Ingress and Load Balancer

### Step 5.1: Install NGINX Ingress Controller

```bash
# Add Helm repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install ingress controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### Step 5.2: Create Ingress Resource

#### Ingress (`devops/k8s/manifests/ingress.yaml`)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: devops-learning-platform-ingress
  namespace: devops-learning-platform
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - devops-learning.local
    secretName: devops-learning-tls
  rules:
  - host: devops-learning.local
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: devops-backend-service
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: devops-frontend-service
            port:
              number: 80
```

### Step 5.3: Setup Local DNS

```bash
# Add to /etc/hosts
echo "127.0.0.1 devops-learning.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 api.devops-learning.local" | sudo tee -a /etc/hosts
```

## 📊 Phase 6: Monitoring Stack

### Step 6.1: Install Prometheus

```bash
# Add Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin123
```

### Step 6.2: Configure Service Monitor

#### Service Monitor (`devops/k8s/manifests/service-monitor.yaml`)
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: devops-learning-platform-monitor
  namespace: devops-learning-platform
spec:
  selector:
    matchLabels:
      app: devops-backend
  endpoints:
  - port: http
    interval: 30s
    path: /metrics
```

### Step 6.3: Access Monitoring Tools

```bash
# Access Prometheus
kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090 -n monitoring

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
# Login: admin/admin123
```

## 🏗️ Phase 7: Infrastructure as Code

### Step 7.1: Terraform EKS Setup

#### main.tf
```hcl
provider "aws" {
  region = var.aws_region
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = var.cluster_name
  cluster_version = "1.28"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  node_groups = {
    main = {
      desired_capacity = 3
      max_capacity     = 10
      min_capacity     = 3
      
      instance_types = ["t3.medium"]
    }
  }
}
```

### Step 7.2: Deploy Infrastructure

```bash
# Initialize Terraform
cd devops/terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

## 🚀 Phase 8: Complete Deployment

### Step 8.1: Automated Deployment Script

```bash
#!/bin/bash
# deploy-to-eks.sh

# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name devops-learning-cluster

# Deploy ingress controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Deploy application
helm install devops-learning-platform ./devops/k8s/helm/devops-learning-platform/ \
  --namespace devops-learning-platform \
  --create-namespace

# Deploy monitoring
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "Deployment completed!"
```

### Step 8.2: Verification Commands

```bash
# Check all pods
kubectl get pods --all-namespaces

# Check services
kubectl get services -n devops-learning-platform

# Check ingress
kubectl get ingress -n devops-learning-platform

# Check HPA
kubectl get hpa -n devops-learning-platform

# Test application
curl -k https://devops-learning.local/api/courses
```

## 📋 Implementation Checklist

### ✅ Phase 1: Containerization
- [ ] Create multi-stage Dockerfile for backend
- [ ] Create multi-stage Dockerfile for frontend
- [ ] Create Docker Compose configuration
- [ ] Test local Docker setup
- [ ] Optimize image sizes

### ✅ Phase 2: Kubernetes
- [ ] Create namespace manifest
- [ ] Create ConfigMap for environment variables
- [ ] Create backend deployment with health checks
- [ ] Create frontend deployment with health checks
- [ ] Create services for backend and frontend
- [ ] Create HPA for auto-scaling
- [ ] Test Kubernetes deployment

### ✅ Phase 3: CI/CD
- [ ] Create GitHub Actions workflow
- [ ] Add testing stages for backend and frontend
- [ ] Add security scanning with Trivy
- [ ] Add Docker build and push stages
- [ ] Configure ArgoCD application
- [ ] Test CI/CD pipeline

### ✅ Phase 4: Helm
- [ ] Create Helm chart structure
- [ ] Create templated deployments
- [ ] Configure values for different environments
- [ ] Test Helm deployment
- [ ] Create upgrade procedures

### ✅ Phase 5: Ingress
- [ ] Install NGINX Ingress Controller
- [ ] Create ingress resource with SSL
- [ ] Configure load balancer
- [ ] Setup local DNS mapping
- [ ] Test external access

### ✅ Phase 6: Monitoring
- [ ] Install Prometheus and Grafana
- [ ] Create service monitors
- [ ] Configure alerting rules
- [ ] Create custom dashboards
- [ ] Test monitoring endpoints

### ✅ Phase 7: Infrastructure
- [ ] Create Terraform configurations
- [ ] Deploy EKS cluster
- [ ] Configure VPC and networking
- [ ] Setup IAM roles and policies
- [ ] Test infrastructure

### ✅ Phase 8: Deployment
- [ ] Create deployment scripts
- [ ] Test complete deployment
- [ ] Verify all components
- [ ] Document access procedures
- [ ] Create troubleshooting guide

## 🔧 Troubleshooting

### Common Issues

1. **Docker Build Failures**
   ```bash
   # Check Docker daemon
   docker info
   
   # Clean build cache
   docker system prune -a
   ```

2. **Kubernetes Pod Issues**
   ```bash
   # Check pod logs
   kubectl logs -f deployment/devops-backend -n devops-learning-platform
   
   # Describe pod for events
   kubectl describe pod <pod-name> -n devops-learning-platform
   ```

3. **Ingress Not Working**
   ```bash
   # Check ingress controller
   kubectl get pods -n ingress-nginx
   
   # Check ingress resource
   kubectl describe ingress -n devops-learning-platform
   ```

4. **Monitoring Issues**
   ```bash
   # Check Prometheus targets
   kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090 -n monitoring
   # Visit http://localhost:9090/targets
   ```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Charts Guide](https://helm.sh/docs/chart_template_guide/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [AWS EKS Guide](https://docs.aws.amazon.com/eks/)

## 🎯 Success Metrics

- **Build Time**: Multi-stage builds reduce image size by 60-70%
- **Deployment Time**: Automated deployment completes in under 10 minutes
- **Scalability**: HPA scales from 3 to 10 pods based on load
- **Monitoring**: 99.9% uptime with comprehensive alerting
- **Security**: All containers run as non-root users
- **GitOps**: All changes deployed through ArgoCD automatically

---

This comprehensive plan provides everything needed to implement a production-ready DevOps infrastructure for the learning platform. Follow each phase sequentially, and use the verification commands to ensure each step is working correctly before proceeding to the next phase.
