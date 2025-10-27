# 📝 Form Builder

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.3.4-blue)](https://mui.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748)](https://prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)](https://docker.com/)

## 🚀 Features

### ✨ Core Features
- **🎨 Modern UI/UX** - Beautiful design with gradients and animations
- **🤖 AI Assistant** - Generate form fields using natural language
- **👥 Role System** - Administrators and regular users
- **📱 Responsive Design** - Works on all devices
- **🔐 Security** - JWT authentication and password hashing
- **📊 Analytics** - View responses and statistics

### 🛠️ Technical Features
- **⚡ Next.js 15** with Turbopack for fast development
- **🎯 TypeScript** for type safety
- **🎨 Material-UI** for modern design
- **🗄️ PostgreSQL** with Prisma ORM
- **🐳 Docker** for easy deployment
- **🤖 AI Integration** - OpenAI + Ollama (local AI)

## 📋 Table of Contents

- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running](#-running)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [AI Assistant](#-ai-assistant)
- [Database](#-database)
- [Docker](#-docker)
- [Development](#-development)
- [Deployment](#-deployment)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Docker (optional)
- Git

### Clone Repository
```bash
git clone <repository-url>
cd form-builder
```

### Install Dependencies
```bash
npm install
```

## ⚙️ Configuration

### 1. Environment Variables
Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/formbuilderdb"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# OpenAI API (optional)
OPENAI_API_KEY="your-openai-api-key"

# Ollama (for local AI)
OLLAMA_BASE_URL="http://localhost:11434"
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed with test data
npx prisma db seed
```

## 🚀 Running

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production
```bash
npm run build
npm start
```

### With Docker
```bash
docker-compose up --build
```

## 🏗️ Architecture

### Project Structure
```
form-builder/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication route group
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   ├── forms/             # Public forms
│   │   └── profile/           # User profile
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configuration
│   ├── types/                 # TypeScript types
│   └── zod/                   # Validation schemas
├── prisma/                    # Database
├── public/                    # Static files
└── docker-compose.yml         # Docker configuration
```

### Technology Stack

#### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI** - UI components
- **Emotion** - CSS-in-JS

#### Backend
- **Next.js API Routes** - Server logic
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

#### AI & ML
- **OpenAI API** - GPT models
- **Ollama** - Local LLM models
- **LangChain.js** - AI framework

#### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **ESLint** - Linter
- **Prettier** - Code formatting

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register    # Registration
POST /api/auth/login       # Login
POST /api/auth/logout      # Logout
GET  /api/auth/me          # Current user
```

### Forms
```
GET    /api/forms                    # List forms
POST   /api/forms                    # Create form
GET    /api/forms/[id]               # Get form
PUT    /api/forms/[id]               # Update form
DELETE /api/forms/[id]               # Delete form
POST   /api/forms/[id]/submit        # Submit form
POST   /api/forms/[id]/publish       # Publish form
```

### Submissions
```
GET  /api/submissions                # List submissions
POST /api/submissions                # Create submission
GET  /api/submissions/[id]           # Get submission
```

### AI Assistant
```
POST /api/ai/assist                  # Generate fields via AI
```

## 🤖 AI Assistant

### OpenAI (primary)
- Uses GPT-4o-mini for field generation
- Supports Ukrainian and English languages
- Understands context and user requirements

### Ollama (local fallback)
- Free alternative to OpenAI
- Runs locally via Docker
- Uses CodeLlama model

### Example Requests
```
"Add a phone field, required"
"Create a registration form with fields: name, email, password"
"Add a number field for age"
"Create a text area for comments"
```

## 🗄️ Database

### Models

#### User
```sql
- id: String (Primary Key)
- email: String (Unique)
- passwordHash: String
- role: Role (ADMIN/USER)
- createdAt: DateTime
```

#### Form
```sql
- id: String (Primary Key)
- title: String
- slug: String (Unique)
- description: String?
- published: Boolean
- fields: Json
- createdAt: DateTime
- updatedAt: DateTime
- userId: String? (Foreign Key)
```

#### Submission
```sql
- id: String (Primary Key)
- data: Json
- formId: String (Foreign Key)
- userId: String? (Foreign Key)
- anonymous: Boolean
- createdAt: DateTime
```

### Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

## 🐳 Docker

### Running with Docker Compose
```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Services
- **web** - Next.js application (port 3000)
- **db** - PostgreSQL database (port 5432)
- **ollama** - AI service (port 11434)

### Ollama Setup
```bash
# Connect to Ollama container
docker exec -it form_builder_ollama bash

# Download model
ollama pull codellama:7b

# Check models
ollama list
```

## 💻 Development

### Development Commands
```bash
# Run in development mode
npm run dev

# Build project
npm run build

# Linting
npm run lint

# Code formatting
npx prettier --write .
```

### Creating New Components
```bash
# Create component
mkdir src/components/NewComponent
touch src/components/NewComponent/index.tsx
```

### Adding New API Routes
```bash
# Create API route
mkdir src/app/api/new-endpoint
touch src/app/api/new-endpoint/route.ts
```

### Working with Database
```bash
# Generate Prisma client after changes
npx prisma generate

# Create migration
npx prisma migrate dev --name add_new_field

# View database
npx prisma studio
```

## 🚀 Deployment

### Vercel (recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel Dashboard
3. Deployment will happen automatically

### Docker on Server
```bash
# Clone on server
git clone <repository-url>
cd form-builder

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Production Environment Variables
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="super-secure-jwt-secret"
OPENAI_API_KEY="your-openai-key"
```

## 📊 Monitoring & Logging

### Logs
- **Development**: Browser console and terminal
- **Production**: Vercel Analytics or custom logger

### Metrics
- Number of created forms
- Number of submissions
- AI assistant usage
- Errors and exceptions

## 🔒 Security

### Authentication
- JWT tokens with short expiration
- Password hashing with bcryptjs
- Protected API routes

### Validation
- Zod schemas for data validation
- Input sanitization
- CSRF protection via Next.js

### Database
- Prepared queries via Prisma
- Schema-level validation
- Role-based access control

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Tests with coverage
npm run test:coverage
```

### Test Data
```bash
# Seed with test data
npx prisma db seed
```

## 🤝 Contributing

### Development Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Create Pull Request

### Code Standards
- TypeScript for type safety
- ESLint for linting
- Prettier for formatting
- Conventional Commits for commits
