# College Discovery Platform

A production-ready full-stack MVP for searching, comparing, and predicting Indian engineering colleges.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL

## Project Structure

```txt
frontend/
  app/
  components/
  lib/
  styles/
backend/
  src/
    routes/
    controllers/
    services/
    prisma/
    middleware/
  prisma/
    schema.prisma
    seed.ts
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

The API runs on `http://localhost:4000` by default.

Required environment variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/college_discovery?schema=public"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

Optional environment variable:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000/api"
```

## API Routes

- `GET /api/colleges?search=&location=&course=&minFees=&maxFees=&page=1&limit=9`
- `GET /api/colleges/:id`
- `GET /api/compare?ids=1,2,3`
- `POST /api/predict` with `{ "exam": "JEE", "rank": 25000 }`
- `GET /api/filters`
- `GET /api/health`

## Deployment

Frontend deploys cleanly to Vercel from `frontend/`. Set `NEXT_PUBLIC_API_BASE_URL` to your hosted backend API URL.

Backend deploys to Render or Railway from `backend/`. Set `DATABASE_URL`, `PORT`, and `CORS_ORIGIN`. Run Prisma migrations during deploy with:

```bash
npm run prisma:deploy
```

Seed production data once with:

```bash
npm run seed
```

## Validation And Edge Cases

The backend validates pagination, fee ranges, IDs, compare limits, and predictor rank input. The frontend includes loading, empty, and error states for listing, detail, comparison, and predictor flows.
