# DevOps Implementation Guide

This directory contains comprehensive DevOps configurations for the DevOps Learning Platform, implementing containerization, CI/CD, Kubernetes deployment to EKS, monitoring, and infrastructure as code.

## 📁 Directory Structure

```
devops/
├── docker/                     # Docker configurations
│   ├── Dockerfile.backend      # Multi-stage backend Dockerfile
│   ├── Dockerfile.frontend     # Multi-stage frontend Dockerfile
│   ├── nginx.conf              # Nginx configuration for frontend
│   └── docker-compose.yml      # Local development setup
├── k8s/                        # Kubernetes manifests
│   ├── manifests/              # Raw Kubernetes YAML files
│   └── helm/                   # Helm charts
├── ci-cd/                      # CI/CD configurations
│   ├── github-actions/         # GitHub Actions workflows
│   └── argocd/                 # ArgoCD applications
├── monitoring/                 # Monitoring stack
│   ├── prometheus/             # Prometheus configuration
│   └── grafana/                # Grafana dashboards
├── ingress/                    # Ingress controller setup
├── dns/                        # DNS configurations
└── terraform/                  # Infrastructure as Code
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- kubectl
- Helm 3.x
- AWS CLI configured
- Terraform (for infrastructure)
- Git (for version control)

### Installation Scripts

The `devops/scripts/` directory contains automated setup scripts:

- `local-setup.sh` - Complete local development setup
- `deploy-to-eks.sh` - Deploy to EKS cluster
- `setup-monitoring.sh` - Deploy monitoring stack
- `validate-manifests.sh` - Validate all configurations
- `test-docker-build.sh` - Test Docker builds

### 1. Local Development with Docker Compose

#### Automated Setup
```bash
# Run the automated setup script
./devops/scripts/local-setup.sh
```

#### Manual Setup
```bash
# Build and run locally
cd devops/docker
docker-compose up --build

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### Test Docker Builds
```bash
# Test multi-stage builds
./devops/scripts/test-docker-build.sh
```

### 2. Deploy to EKS

#### Step 1: Create Infrastructure

```bash
cd devops/terraform
terraform init
terraform plan
terraform apply
```

#### Step 2: Configure kubectl

```bash
aws eks update-kubeconfig --region us-west-2 --name devops-learning-cluster
```

#### Step 3: Deploy with Automated Script

```bash
# Run the automated deployment script
./devops/scripts/deploy-to-eks.sh
```

#### Manual Deployment

```bash
# Add required Helm repositories
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install ingress controller
kubectl apply -f devops/ingress/nginx-ingress-controller.yaml

# Install cert-manager
kubectl apply -f devops/ingress/cert-manager.yaml

# Deploy the application
helm install devops-learning-platform devops/k8s/helm/devops-learning-platform/ \
  --namespace devops-learning-platform \
  --create-namespace

# Deploy monitoring stack
./devops/scripts/setup-monitoring.sh
```

#### Alternative: Deploy with Kustomize

```bash
# Deploy to staging
kubectl apply -k devops/k8s/kustomization/overlays/staging/

# Deploy to production
kubectl apply -k devops/k8s/kustomization/overlays/production/
```

#### Step 4: Setup ArgoCD

```bash
# Install ArgoCD (already included in Terraform)
kubectl apply -f devops/ci-cd/argocd/project.yaml
kubectl apply -f devops/ci-cd/argocd/application.yaml

# Get ArgoCD admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### 3. Configure DNS

#### For Local Testing

```bash
# Add to /etc/hosts
echo "127.0.0.1 devops-learning.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 api.devops-learning.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 grafana.devops-learning.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 prometheus.devops-learning.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 argocd.devops-learning.local" | sudo tee -a /etc/hosts
```

#### For Production

Update the DNS records to point to your EKS LoadBalancer IP:

```bash
# Get LoadBalancer IP
kubectl get svc ingress-nginx-controller -n ingress-nginx

# Update DNS records in your domain provider
# devops-learning.yourdomain.com -> <LOAD_BALANCER_IP>
```

## 🔧 Configuration Details

### Docker Multi-Stage Builds

- **Backend**: Python 3.12 with Poetry, optimized for production
- **Frontend**: Node.js 18 with Nginx, static file serving
- **Security**: Non-root users, read-only filesystems, minimal attack surface
- **Optimization**: Multi-stage builds reduce image size by 60-70%
- **Health Checks**: Built-in health checks for container orchestration

### Kubernetes Deployment

- **Namespace**: `devops-learning-platform`
- **Backend**: 3 replicas with HPA (3-10 pods)
- **Frontend**: 2 replicas with HPA (2-6 pods)
- **Resources**: Proper limits and requests configured
- **Security**: Pod security contexts, network policies

### CI/CD Pipeline

- **GitHub Actions**: Automated testing, building, and deployment
- **ArgoCD**: GitOps-based continuous deployment
- **Security**: Vulnerability scanning with Trivy
- **Multi-environment**: Staging and production workflows

### Monitoring Stack

- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards with pre-configured dashboards
- **Alertmanager**: Alert routing and notification management
- **Alerts**: CPU, memory, error rate, pod restart monitoring
- **Service Discovery**: Automatic Kubernetes service discovery
- **Custom Metrics**: Application-specific metrics endpoint (/metrics)

### Ingress and Load Balancing

- **NGINX Ingress Controller**: Layer 7 load balancing
- **AWS Load Balancer**: Layer 4 load balancing
- **SSL/TLS**: Automatic certificate management with cert-manager
- **Rate Limiting**: Protection against abuse

## 📊 Monitoring and Observability

### Access Monitoring Tools

```bash
# Prometheus
kubectl port-forward svc/prometheus-service 9090:9090 -n monitoring
# Open http://localhost:9090

# Grafana
kubectl port-forward svc/grafana 3000:3000 -n monitoring
# Open http://localhost:3000 (admin/admin123)

# Alertmanager
kubectl port-forward svc/alertmanager 9093:9093 -n monitoring
# Open http://localhost:9093

# ArgoCD
kubectl port-forward svc/argocd-server 8080:80 -n argocd
# Open http://localhost:8080
```

### Automated Setup

```bash
# Setup monitoring stack
./devops/scripts/setup-monitoring.sh
```

### Key Metrics

- HTTP request rate and latency
- Pod CPU and memory usage
- Application error rates
- Kubernetes cluster health
- Custom business metrics

## 🔒 Security Best Practices

### Container Security

- Multi-stage builds for minimal image size
- Non-root users in all containers
- Read-only root filesystems
- Dropped capabilities
- Security scanning in CI pipeline

### Kubernetes Security

- Pod Security Standards enforcement
- Network policies for traffic isolation
- RBAC for fine-grained access control
- Secrets management
- Regular security updates

### Infrastructure Security

- VPC with private subnets
- Security groups with minimal access
- IAM roles with least privilege
- Encrypted storage
- Regular backup and disaster recovery

## 🛠️ Troubleshooting

### Common Issues

1. **Pods not starting**: Check resource limits and node capacity
2. **Ingress not working**: Verify DNS configuration and certificates
3. **Monitoring not collecting metrics**: Check service discovery configuration
4. **ArgoCD sync issues**: Verify repository access and RBAC permissions

### Useful Commands

```bash
# Check pod status
kubectl get pods -n devops-learning-platform

# View logs
kubectl logs -f deployment/devops-backend -n devops-learning-platform

# Check ingress
kubectl get ingress -n devops-learning-platform

# Scale deployment
kubectl scale deployment devops-backend --replicas=5 -n devops-learning-platform

# Check HPA status
kubectl get hpa -n devops-learning-platform

# View events
kubectl get events -n devops-learning-platform --sort-by='.lastTimestamp'

# Validate configurations
./devops/scripts/validate-manifests.sh

# Test Docker builds
./devops/scripts/test-docker-build.sh
```

## 📈 Scaling and Performance

### Horizontal Pod Autoscaling

- Backend: Scales based on CPU (70%) and memory (80%) usage
- Frontend: Scales based on CPU (70%) and memory (80%) usage
- Custom metrics can be added for more sophisticated scaling

### Cluster Autoscaling

- EKS managed node groups with auto-scaling
- Spot instances for cost optimization
- Multiple availability zones for high availability

### Performance Optimization

- Resource requests and limits tuned for workload
- Nginx caching for static assets
- Database connection pooling
- CDN integration for global distribution

## 🔄 GitOps Workflow

### Development Process

1. **Code Changes**: Push to feature branch
2. **CI Pipeline**: Automated testing and building
3. **Image Push**: Container images pushed to registry
4. **ArgoCD Sync**: Automatic deployment to staging
5. **Manual Approval**: Production deployment approval
6. **Monitoring**: Continuous monitoring and alerting

### Environment Promotion

- **Development**: Local Docker Compose
- **Staging**: EKS cluster with staging namespace
- **Production**: EKS cluster with production namespace
- **Rollback**: Automated rollback on health check failures

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
