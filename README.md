# DevOps Learning Platform

A comprehensive learning platform for DevOps skills with pre-built courses covering essential DevOps topics including CI/CD, containerization, orchestration, monitoring, and cloud practices.

## 🚀 Features

- **Interactive Course Catalog**: Browse 6 comprehensive DevOps courses
- **Progressive Learning**: Structured lessons with video content and hands-on exercises
- **Progress Tracking**: Track completion status and learning progress
- **Modern Tech Stack**: FastAPI backend with React TypeScript frontend
- **Responsive Design**: Mobile-friendly interface with professional UI

## 📚 Available Courses

1. **DevOps Fundamentals** - Introduction to DevOps culture and methodology
2. **CI/CD Pipeline Mastery** - Continuous Integration and Deployment with Jenkins and GitHub Actions
3. **Docker & Containerization** - Container orchestration with Docker and Docker Compose
4. **Kubernetes Orchestration** - Container orchestration at scale
5. **Monitoring & Observability** - Application and infrastructure monitoring
6. **AWS Cloud DevOps** - Cloud-native DevOps practices on AWS

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.12
- **API Endpoints**: RESTful API for courses, lessons, and progress tracking
- **Data Storage**: In-memory database (suitable for development/demo)
- **Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Query for server state management
- **Routing**: React Router for client-side navigation
- **Icons**: Lucide React for consistent iconography

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.12+ and Poetry
- Git

### Backend Setup
```bash
cd devops-backend
poetry install
poetry run fastapi dev app/main.py
```
The backend will be available at `http://localhost:8000`

### Frontend Setup
```bash
cd devops-frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key API Endpoints
- `GET /api/courses` - List all courses
- `GET /api/courses/{course_id}` - Get course details
- `GET /api/courses/{course_id}/lessons/{lesson_id}` - Get lesson content
- `GET /api/categories` - List course categories
- `GET /api/progress/{course_id}` - Get user progress
- `POST /api/progress/{course_id}` - Update user progress

## 🐳 DevOps Implementation

This repository includes a comprehensive **DevOps Implementation Guide** (`DevOps-Implementation-Guide.md` and `.pdf`) that provides step-by-step instructions for implementing:

- **Docker & Docker Compose** - Containerization and local orchestration
- **Kubernetes** - Production-ready container orchestration
- **CI/CD Pipelines** - GitHub Actions and GitLab CI configurations
- **Monitoring & Observability** - Prometheus, Grafana, and ELK stack
- **GitOps** - ArgoCD for automated deployments
- **Ingress Controllers** - NGINX with SSL/TLS termination
- **Security Best Practices** - RBAC, network policies, and secrets management

## 📁 Project Structure

```
devops-learning-app/
├── devops-backend/           # FastAPI backend application
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── models.py        # Data models (Course, Lesson, Progress)
│   │   └── data.py          # Sample course data
│   ├── pyproject.toml       # Python dependencies and project config
│   └── README.md            # Backend-specific documentation
├── devops-frontend/         # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Home, Course, Lesson)
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main application component
│   ├── package.json         # Node.js dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── vite.config.ts       # Vite build configuration
├── DevOps-Implementation-Guide.md  # Comprehensive DevOps guide
├── DevOps-Implementation-Guide.pdf # PDF version of the guide
└── README.md                # This file
```

## 🔧 Development

### Backend Development
```bash
cd devops-backend
poetry install
poetry run fastapi dev app/main.py --reload
```

### Frontend Development
```bash
cd devops-frontend
npm install
npm run dev
```

### Testing
```bash
# Backend tests
cd devops-backend
poetry run pytest

# Frontend tests
cd devops-frontend
npm run test
```

### Linting
```bash
# Backend linting
cd devops-backend
poetry run flake8 app/

# Frontend linting
cd devops-frontend
npm run lint
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build -d
```

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

### Production Deployment
Follow the comprehensive DevOps Implementation Guide for production-ready deployment with:
- Container orchestration
- CI/CD automation
- Monitoring and logging
- Security hardening
- Load balancing and scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Learning Objectives

After completing the courses in this platform, learners will be able to:

- Understand DevOps culture, practices, and principles
- Implement CI/CD pipelines using modern tools
- Containerize applications with Docker
- Orchestrate containers at scale with Kubernetes
- Set up comprehensive monitoring and observability
- Deploy and manage cloud-native applications
- Apply security best practices in DevOps workflows
- Implement Infrastructure as Code (IaC)

## 🔗 Additional Resources

- [DevOps Roadmap](https://roadmap.sh/devops)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## 📞 Support

For questions, issues, or contributions, please:
- Open an issue in this repository
- Check the DevOps Implementation Guide for detailed setup instructions
- Review the API documentation at `/docs` endpoint

---

**Built with ❤️ for the DevOps community**
