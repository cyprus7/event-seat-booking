# Event Seat Booking

A production-ready monorepo for an event seat booking system built with NestJS (backend) and Next.js (frontend).

## 🏗️ Project Structure

```
event-seat-booking/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── config/       # Configuration files
│   │   │   ├── database/     # Database setup
│   │   │   ├── modules/      # Feature modules
│   │   │   │   ├── events/   # Events module
│   │   │   │   ├── bookings/ # Bookings module
│   │   │   │   └── users/    # Users module
│   │   │   ├── common/       # Shared utilities
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── test/
│   └── frontend/             # Next.js application
│       ├── src/
│       │   ├── app/          # App router pages
│       │   ├── components/   # React components
│       │   ├── hooks/        # Custom React hooks
│       │   ├── lib/          # Libraries and utilities
│       │   └── utils/        # Utility functions
│       └── public/
├── packages/
│   └── shared/               # Shared types and DTOs
│       └── src/
│           ├── types/        # TypeScript interfaces
│           └── dto/          # Data Transfer Objects
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline
├── docker-compose.yml        # Docker services
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── jest.config.js           # Jest configuration
└── package.json             # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cyprus7/event-seat-booking.git
cd event-seat-booking
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

4. Start Docker services (Postgres, Redis, RabbitMQ):
```bash
npm run docker:up
```

### Development

Run the backend (API server):
```bash
npm run backend:dev
```

Run the frontend (Next.js dev server):
```bash
npm run frontend
```

The applications will be available at:
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs
- Frontend: http://localhost:3000

## 📦 Available Scripts

### Root Level
- `npm run backend` - Start backend in production mode
- `npm run backend:dev` - Start backend in development mode
- `npm run backend:build` - Build backend
- `npm run frontend` - Start frontend in development mode
- `npm run frontend:build` - Build frontend
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run format` - Format code with Prettier
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS 10
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

### Frontend (Next.js)
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React hooks

### Shared
- **Language**: TypeScript 5
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## 🐳 Docker Services

The `docker-compose.yml` includes:
- **PostgreSQL**: Database (port 5432)
- **Redis**: Caching and session management (port 6379)
- **RabbitMQ**: Message broker (ports 5672, 15672 for management UI)

Access RabbitMQ Management UI at: http://localhost:15672 (guest/guest)

## 📝 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/event/:eventId` - Get bookings for event
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:cov
```

## 🔧 Configuration

### Backend Configuration
Edit `apps/backend/.env`:
- Database connection
- Redis connection
- RabbitMQ connection
- CORS settings

### Frontend Configuration
Edit `apps/frontend/.env`:
- API URL

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request