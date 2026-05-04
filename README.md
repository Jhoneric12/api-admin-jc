# API Template Express

Express + TypeScript + Prisma (MySQL) starter API.

## Prerequisites

- Node.js 22.21.1 (from `.nvmrc`)
- npm
- MySQL database

## Installation and Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

3. Update `.env` with your values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"

# Optional (only if you use split DB settings in custom code)
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_HOST=
```

Environment variable rules:

- Required: `DATABASE_URL` (used by Prisma via `prisma.config.ts`)
- Optional: `PORT` (defaults to `3000`)
- Optional: `NODE_ENV` (defaults to `development`)
- Optional: `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_HOST` (available in env config, not required by Prisma setup)

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run database migrations (development):

```bash
npm run prisma:migrate
```

6. Start development server:

```bash
npm run dev
```

The dev server runs with nodemon + tsx and starts from `server/bin/www.ts`.

## Available Scripts

- `npm run dev` - Start dev server with auto-reload
- `npm run build` - Build TypeScript output
- `npm run start` - Start compiled server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create/apply Prisma migration (dev)
- `npm run generate` - Run code scaffolding script

## Code Generation Commands

This project includes a scaffolder at `server/src/scripts/scaffolding.ts`.

### Basic usage

Generate module files using path format:

```bash
npm run generate -- v1/user
```

This creates files under these layer folders (default):

- `controllers`
- `services`
- `routes`
- `validations`

### Named arguments

```bash
npm run generate -- --dir v1 --name user
```

This is equivalent to `v1/user`.

### Generate specific layers only

Use one or more layer flags:

```bash
npm run generate -- v1/user --controllers --routes
```

Supported layer flags:

- `--controllers` or `--controller`
- `--services` or `--service`
- `--repositories` or `--repository`
- `--routes` or `--route`
- `--validations` or `--validation`

### More examples

```bash
# Generate admin/product module with default layers
npm run generate -- admin/product

# Generate only repository + service
npm run generate -- admin/product --repositories --services
```

## Build and Run (Production style)

```bash
npm run build
npm run start
```

## API Route Prefix

Current versioned routes are mounted under:

- `/v1`
