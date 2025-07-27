# Forest Fires API

A Fastify-based REST API for querying and managing forest fire data, including filtering, pagination, and user-specific configuration storage.

## Features

- REST API built with Fastify
- Fetches forest fire data from an external open data API
- Supports filtering, pagination, and geospatial queries (nearby fires)
- User-specific filter configuration storage using SQLite and Prisma ORM
- OpenAPI/Swagger documentation available at `/docs`

## Project Structure

- `src/server.ts` - Fastify server entry point
- `src/routes/` - API route definitions
- `src/services/` - Business logic and data fetching
- `src/types/` - TypeScript types and enums
- `src/utils/` - Utility functions (date, haversine, fetch helpers)
- `src/prisma.ts` - Prisma client instance
- `prisma/schema.prisma` - Database schema (SQLite)
- `prisma/migrations/` - Database migrations

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Generate the Prisma client and migrate the database:

   ```sh
   npx prisma generate
   npx prisma migrate deploy
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Access the API documentation at [http://localhost:3000/docs](http://localhost:3000/docs)

## Environment Variables

- `.env` - Used for database connection configuration (see [prisma/schema.prisma](prisma/schema.prisma))

## API Endpoints

- `GET /api/fires` - List fires with pagination
- `GET /api/fires/filtered` - List fires with filters
- `GET /api/fires/nearby` - List fires near a location
- `POST /api/configurations` - Save user filter configuration
- `GET /api/configurations/:userId` - Get configurations for a user
- `GET /health` - Health check
