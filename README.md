# AINav Cloud

AINav Cloud is an AI tools directory built for Vercel.

- Frontend: Vue 3 + Vite
- Backend: Vercel Node.js Serverless Functions in `api/`
- Database: Supabase PostgreSQL

## Project Structure

```text
.
├── api/              # Vercel Node.js API routes
├── frontend/         # Vue 3 frontend
├── supabase/         # Supabase/Postgres schema
├── vercel.json       # Vercel deployment config
└── package.json      # Root scripts and API dependencies
```

## Secrets

Do not commit real database passwords to GitHub. Keep real values in local `.env` files or deployment platform environment variables.

Vercel needs these environment variables:

```bash
SUPABASE_DB_URL=jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
SUPABASE_DB_USERNAME=postgres.tnzegssjrbpbnmviufzk
SUPABASE_DB_PASSWORD=your-real-password
```

`SUPABASE_DB_URL` may also use a normal `postgresql://` URL. The API automatically converts the existing `jdbc:postgresql://` format for Node.js.

## Vercel Deployment

`vercel.json` deploys both the frontend and the API routes:

- Build command: `npm --prefix frontend run build`
- Output directory: `frontend/dist`
- API routes: `api/*.js`

Production frontend requests use same-origin `/api`, so `VITE_API_BASE_URL` is usually not needed on Vercel.

## Local Development

Install dependencies:

```bash
npm install
npm --prefix frontend install
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

For local Vercel API testing, use the Vercel CLI and set the Supabase environment variables locally.

## API

- `GET /api/health`
- `GET /api/categories`
- `GET /api/tools`
- `GET /api/tools?category=dev`
- `GET /api/tools?q=video`
- `GET /api/tools?featured=true`

## Supabase

If you need to create the tables manually, run this file in the Supabase SQL Editor:

```text
supabase/schema.sql
```
