# Cloud TP - Automated Deployment Project

This project demonstrates the containerization and automated deployment of a web application using Docker, Docker Compose, and prepares for CI/CD and Kubernetes deployment.

To get to the assignement report, check [this file](./rapport/rapport.md)

## CI/CD Pipeline

This project includes an automated CI/CD pipeline using GitHub Actions that handles the complete deployment workflow.

### Pipeline Flow
```
git push → CI/CD → Install Dependencies → Run Tests → Build Docker → Push Image → Deploy to VM → Update Kubernetes
```

### Automatic Triggers
- **Push to main/master branch**: Full CI/CD pipeline execution
- **Pull Request**: CI checks (dependencies, tests, build) without deployment

### Pipeline Steps
1. **Install Dependencies**: `npm ci` for clean dependency installation
2. **Run Tests**: `npm test` (placeholder for now)
3. **Build Docker**: Creates Docker image for the API
4. **Push Image**: Pushes to GitHub Container Registry (ghcr.io)
5. **Deploy to VM**: SSH connection to Azure VM
6. **Update Kubernetes**: Applies new image to Kubernetes deployment

### Required GitHub Secrets
Set these in your repository settings under "Secrets and variables" → "Actions":

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AZURE_VM_HOST` | Azure VM public IP | `108.143.184.247` |
| `AZURE_VM_USER` | SSH username | `bastienpf` |
| `AZURE_VM_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### Setting up SSH Access
1. **Generate SSH key pair** (on your local machine):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions@your-repo"
   ```

2. **Add public key to Azure VM**:
   ```bash
   ssh-copy-id bastienpf@108.143.184.247
   ```

3. **Add private key to GitHub Secrets**:
   - Copy the entire private key (including `-----BEGIN OPENSSH PRIVATE KEY-----`)
   - Paste into GitHub repository secrets as `AZURE_VM_SSH_KEY`

### Pipeline Status
Check the "Actions" tab in your GitHub repository to monitor pipeline execution.

### Manual Pipeline Triggers
You can also trigger the pipeline manually from the Actions tab.

## Architecture

The application consists of two services:
- **API Service**: Node.js/Express REST API that exposes endpoints and connects to the database
- **Database Service**: PostgreSQL database with user and product tables

## Features

- Containerized application using Docker
- Multi-service orchestration with Docker Compose
- Health check endpoint (`/health`) that verifies database connectivity
- Environment variable management for configuration
- Database schema with users and products tables
- Prepared for CI/CD pipeline integration

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

## Local Development Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd cloud-tp
```

### 2. Install dependencies (for local development)
```bash
npm install
```

### 3. Configure environment variables
Copy the `.env` file and adjust values if needed:
```bash
cp .env .env.local  # Optional, for local overrides
```

### 4. Run locally (without Docker)
```bash
# Start PostgreSQL separately or use Docker Compose
npm run dev
```

## Docker Deployment

### Build and run with Docker Compose
```bash
# Build and start services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Access the application
- API: http://localhost:3000
- Health check: http://localhost:3000/health
- Database: localhost:5432 (accessible from host for development)

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check with database connectivity status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host | db |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | mydb |
| DB_USER | Database user | user |
| DB_PASS | Database password | password |
| PORT | API port | 3000 |

## Project Structure

```
cloud-tp/
├── src/
│   └── app.js              # Main API application
├── Dockerfile              # API container definition
├── docker-compose.yml      # Multi-service orchestration
├── package.json            # Node.js dependencies
├── init.sql                # Database initialization
├── .env                    # Environment variables
├── README.md               # This file
└── rapport.md              # Assignment report
```

## Future Enhancements

- [ ] Add CRUD operations for users and products
- [ ] Implement authentication and authorization
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Deploy to Kubernetes cluster
- [ ] Deploy to Azure VM
- [ ] Add monitoring and logging
- [ ] Implement secrets management

## Testing

### Health Check
```bash
curl http://localhost:3000/health
# Expected response: {"status":"ok","database":"connected"}
```

### Database Connection
Connect to PostgreSQL container:
```bash
docker-compose exec db psql -U user -d mydb
```

## Troubleshooting

- **Port conflicts**: Ensure ports 3000 and 5432 are available
- **Database connection issues**: Check Docker network and environment variables
- **Build failures**: Ensure Docker is running and has sufficient resources

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, AKS, EKS, GKE, etc.)
- `kubectl` configured to access your cluster
- Docker registry access (if using private registry)

### Prepare Docker Images
Before deploying to Kubernetes, push your API image to a registry:
```bash
# Build and tag the image
docker build -t your-registry/cloud-tp-api:latest .

# Push to registry
docker push your-registry/cloud-tp-api:latest

# Update k8s/api-deployment.yaml with your image URL
```

### Deploy to Kubernetes
```bash
# Run the deployment script
./deploy-k8s.sh

# Or apply manifests manually
kubectl apply -f k8s/
```

### Check Deployment Status
```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# View logs
kubectl logs -l app=api
kubectl logs -l app=postgres
```

### Access the Application
```bash
# Get the external IP (for LoadBalancer service)
kubectl get svc api-service

# Test health endpoint
curl http://<EXTERNAL-IP>:3000/health
```

### Kubernetes Manifests
- `k8s/config.yaml` - ConfigMap and Secret for configuration
- `k8s/pvc.yaml` - Persistent volume claim for database storage
- `k8s/init-db-configmap.yaml` - Database initialization script
- `k8s/postgres-deployment.yaml` - PostgreSQL deployment
- `k8s/postgres-service.yaml` - PostgreSQL service
- `k8s/api-deployment.yaml` - API deployment
- `k8s/api-service.yaml` - API service

### Scaling and Management
```bash
# Scale API replicas
kubectl scale deployment api-deployment --replicas=3

# Update deployment
kubectl set image deployment/api-deployment api=your-registry/cloud-tp-api:v2

# Clean up
kubectl delete -f k8s/
```

## License

This project is for educational purposes.