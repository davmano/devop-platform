from datetime import datetime
from .models import Course

def get_sample_courses():
    return [
        {
            "id": "devops-fundamentals",
            "title": "DevOps Fundamentals",
            "description": "Learn the core concepts and principles of DevOps culture, practices, and tools",
            "category": "Fundamentals",
            "difficulty": "Beginner",
            "duration_hours": 8,
            "instructor": "Sarah Johnson",
            "image_url": "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop",
            "lessons": [
                {
                    "id": "lesson-1",
                    "title": "What is DevOps?",
                    "description": "Introduction to DevOps culture and methodology",
                    "content": "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality.",
                    "duration_minutes": 45,
                    "video_url": "https://www.youtube.com/watch?v=_I94-tJlovg",
                    "order": 1
                },
                {
                    "id": "lesson-2", 
                    "title": "DevOps Culture and Principles",
                    "description": "Understanding collaboration, automation, and continuous improvement",
                    "content": "DevOps culture emphasizes collaboration between development and operations teams, automation of processes, and continuous improvement through feedback loops.",
                    "duration_minutes": 60,
                    "video_url": "https://www.youtube.com/watch?v=UbtB4sMaaNM",
                    "order": 2
                },
                {
                    "id": "lesson-3",
                    "title": "DevOps Lifecycle",
                    "description": "Plan, Code, Build, Test, Release, Deploy, Operate, Monitor",
                    "content": "The DevOps lifecycle consists of 8 phases: Plan, Code, Build, Test, Release, Deploy, Operate, and Monitor. Each phase involves specific tools and practices.",
                    "duration_minutes": 50,
                    "video_url": "https://www.youtube.com/watch?v=Xrgk023l4lI",
                    "order": 3
                }
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "cicd-pipeline",
            "title": "CI/CD Pipeline Mastery",
            "description": "Master Continuous Integration and Continuous Deployment with Jenkins, GitHub Actions, and GitLab CI",
            "category": "CI/CD",
            "difficulty": "Intermediate",
            "duration_hours": 12,
            "instructor": "Mike Chen",
            "image_url": "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=300&fit=crop",
            "lessons": [
                {
                    "id": "lesson-1",
                    "title": "Introduction to CI/CD",
                    "description": "Understanding Continuous Integration and Continuous Deployment",
                    "content": "CI/CD is a method to frequently deliver apps to customers by introducing automation into the stages of app development.",
                    "duration_minutes": 40,
                    "video_url": "https://www.youtube.com/watch?v=1er2cjUq1UI",
                    "order": 1
                },
                {
                    "id": "lesson-2",
                    "title": "Setting up Jenkins",
                    "description": "Install and configure Jenkins for CI/CD",
                    "content": "Jenkins is an open-source automation server that enables developers to build, test, and deploy their applications.",
                    "duration_minutes": 75,
                    "video_url": "https://www.youtube.com/watch?v=FX322RVNGj4",
                    "order": 2
                },
                {
                    "id": "lesson-3",
                    "title": "GitHub Actions Workflows",
                    "description": "Create automated workflows with GitHub Actions",
                    "content": "GitHub Actions makes it easy to automate all your software workflows with CI/CD capabilities.",
                    "duration_minutes": 65,
                    "video_url": "https://www.youtube.com/watch?v=R8_veQiYBjI",
                    "order": 3
                }
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "docker-containerization",
            "title": "Docker & Containerization",
            "description": "Learn containerization with Docker, Docker Compose, and container orchestration",
            "category": "Containerization",
            "difficulty": "Intermediate",
            "duration_hours": 10,
            "instructor": "Alex Rodriguez",
            "image_url": "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop",
            "lessons": [
                {
                    "id": "lesson-1",
                    "title": "Docker Fundamentals",
                    "description": "Introduction to containers and Docker basics",
                    "content": "Docker is a platform that uses OS-level virtualization to deliver software in packages called containers.",
                    "duration_minutes": 55,
                    "video_url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
                    "order": 1
                },
                {
                    "id": "lesson-2",
                    "title": "Dockerfile and Images",
                    "description": "Creating custom Docker images with Dockerfile",
                    "content": "A Dockerfile is a text document that contains commands to assemble a Docker image.",
                    "duration_minutes": 70,
                    "video_url": "https://www.youtube.com/watch?v=LQjaJINkQXY",
                    "order": 2
                },
                {
                    "id": "lesson-3",
                    "title": "Docker Compose",
                    "description": "Multi-container applications with Docker Compose",
                    "content": "Docker Compose is a tool for defining and running multi-container Docker applications.",
                    "duration_minutes": 60,
                    "video_url": "https://www.youtube.com/watch?v=HG6yIjZapSA",
                    "order": 3
                }
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "kubernetes-orchestration",
            "title": "Kubernetes Orchestration",
            "description": "Master container orchestration with Kubernetes, deployments, services, and scaling",
            "category": "Orchestration",
            "difficulty": "Advanced",
            "duration_hours": 15,
            "instructor": "Emily Davis",
            "image_url": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop",
            "lessons": [
                {
                    "id": "lesson-1",
                    "title": "Kubernetes Architecture",
                    "description": "Understanding K8s components and architecture",
                    "content": "Kubernetes is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.",
                    "duration_minutes": 80,
                    "video_url": "https://www.youtube.com/watch?v=X48VuDVv0do",
                    "order": 1
                },
                {
                    "id": "lesson-2",
                    "title": "Pods and Deployments",
                    "description": "Creating and managing Kubernetes workloads",
                    "content": "Pods are the smallest deployable units in Kubernetes. Deployments provide declarative updates for Pods and ReplicaSets.",
                    "duration_minutes": 90,
                    "video_url": "https://www.youtube.com/watch?v=PH-2FfFD2PU",
                    "order": 2
                },
                {
                    "id": "lesson-3",
                    "title": "Services and Networking",
                    "description": "Kubernetes networking and service discovery",
                    "content": "Services enable network access to a set of Pods in Kubernetes clusters.",
                    "duration_minutes": 85,
                    "video_url": "https://www.youtube.com/watch?v=T4Z7visMM4E",
                    "order": 3
                }
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "monitoring-observability",
            "title": "Monitoring & Observability",
            "description": "Implement monitoring solutions with Prometheus, Grafana, and ELK stack",
            "category": "Monitoring",
            "difficulty": "Intermediate",
            "duration_hours": 9,
            "instructor": "David Kim",
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
            "lessons": [
                {
                    "id": "lesson-1",
                    "title": "Monitoring Fundamentals",
                    "description": "Introduction to monitoring and observability concepts",
                    "content": "Monitoring is the practice of collecting, processing, aggregating, and displaying real-time quantitative data about a system.",
                    "duration_minutes": 45,
                    "video_url": "https://www.youtube.com/watch?v=SmF99iVelNo",
                    "order": 1
                },
                {
                    "id": "lesson-2",
                    "title": "Prometheus & Grafana",
                    "description": "Setting up metrics collection and visualization",
                    "content": "Prometheus is an open-source monitoring system with a time-series database. Grafana is a visualization tool.",
                    "duration_minutes": 75,
                    "video_url": "https://www.youtube.com/watch?v=9TJx7QTrTyo",
                    "order": 2
                },
                {
                    "id": "lesson-3",
                    "title": "Log Management with ELK",
                    "description": "Centralized logging with Elasticsearch, Logstash, and Kibana",
                    "content": "The ELK stack consists of Elasticsearch, Logstash, and Kibana for log management and analysis.",
                    "duration_minutes": 70,
                    "video_url": "https://www.youtube.com/watch?v=gS_nHTWZEJ8",
                    "order": 3
                }
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "aws-cloud-devops",
            "title": "AWS Cloud DevOps",
            "description": "DevOps practices on AWS with CodePipeline, ECS, Lambda, and CloudFormation",
            "category": "Cloud",
            "difficulty": "Advanced",
            "duration_hours": 18,
            "instructor": "Jennifer Wilson",
            "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
            "lessons": [
                {
                    "id": "lesson-1",
                    "title": "AWS DevOps Overview",
                    "description": "Introduction to AWS DevOps services and tools",
                    "content": "AWS provides a comprehensive set of DevOps tools including CodeCommit, CodeBuild, CodeDeploy, and CodePipeline.",
                    "duration_minutes": 60,
                    "video_url": "https://www.youtube.com/watch?v=Pvb74TlV8SA",
                    "order": 1
                },
                {
                    "id": "lesson-2",
                    "title": "AWS CodePipeline",
                    "description": "Building CI/CD pipelines with AWS CodePipeline",
                    "content": "AWS CodePipeline is a continuous integration and continuous delivery service for fast and reliable application updates.",
                    "duration_minutes": 95,
                    "video_url": "https://www.youtube.com/watch?v=YxcIj_SLflw",
                    "order": 2
                },
                {
                    "id": "lesson-3",
                    "title": "Infrastructure as Code",
                    "description": "CloudFormation and AWS CDK for infrastructure automation",
                    "content": "Infrastructure as Code (IaC) allows you to manage and provision infrastructure through code instead of manual processes.",
                    "duration_minutes": 105,
                    "video_url": "https://www.youtube.com/watch?v=9Xpuprxg7aY",
                    "order": 3
                }
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
