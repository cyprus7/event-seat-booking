# Project Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Docker Services
```bash
npm run docker:up
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- RabbitMQ on ports 5672 (AMQP) and 15672 (Management UI)

### 3. Configure Environment Variables

Backend:
```bash
cp apps/backend/.env.example apps/backend/.env
```

Frontend:
```bash
cp apps/frontend/.env.example apps/frontend/.env
```

### 4. Start Development Servers

In separate terminals:

```bash
# Start backend (port 3001)
npm run backend:dev

# Start frontend (port 3000)
npm run frontend
```

## Build Commands

### Build All
```bash
npm run backend:build
npm run frontend:build
```

### Build Individual Apps
```bash
# Backend
cd apps/backend && npm run build

# Frontend
cd apps/frontend && npm run build

# Shared package
cd packages/shared && npm run build
```

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

## Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix

# Format code with Prettier
npm run format
```

## Docker Services

### Access Services
- **PostgreSQL**: localhost:5432
  - Username: postgres
  - Password: postgres
  - Database: event_booking

- **Redis**: localhost:6379

- **RabbitMQ**:
  - AMQP: localhost:5672
  - Management UI: http://localhost:15672
    - Username: guest
    - Password: guest

### Stop Services
```bash
npm run docker:down
```

## API Documentation

Once the backend is running, access the Swagger API documentation at:
http://localhost:3001/api/docs

## Project Structure

```
.
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js App
├── packages/
│   └── shared/           # Shared types and DTOs
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml    # Docker services
├── package.json          # Root workspace config
└── tsconfig.json         # Root TypeScript config
```

## Development Workflow

1. Create feature branch
2. Make changes
3. Run tests: `npm run test`
4. Run linter: `npm run lint:fix`
5. Build: `npm run backend:build && npm run frontend:build`
6. Commit and push
7. Create pull request

## CI/CD

The project includes a GitHub Actions workflow that:
- Runs linting on all code
- Executes unit tests with coverage
- Builds backend and frontend
- Runs on push to `main` and `develop` branches
- Runs on pull requests to `main` and `develop` branches

## Tips

- Use the shared package for common types and DTOs across backend and frontend
- Backend uses TypeORM for database operations
- Frontend uses Next.js App Router
- All code is TypeScript
- ESLint and Prettier ensure code quality and consistency
