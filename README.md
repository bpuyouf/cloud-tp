# Cloud TP - Automated Deployment Project

This project demonstrates the containerization and automated deployment of a web application using Docker, Docker Compose, and prepares for CI/CD and Kubernetes deployment.

To get to the assignement report, check [this file](./rapport/rapport.md)

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

## License

This project is for educational purposes.