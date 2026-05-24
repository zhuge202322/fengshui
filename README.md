# LingYun FengShui 灵云风水

A monorepo for the LingYun (灵云) FengShui English-market site:

- **frontend/** (root) — Next.js 14 storefront with divination, articles & shop showcase
- **cms/** — Independent Next.js + Prisma + TipTap CMS for articles & media
- **vendure/** — Vendure 2.x commerce backend for products & orders
- **PostgreSQL** as the single database server (separate DBs per service)

```
┌────────────┐   3000   ┌──────────┐   3001   ┌──────────┐
│  Frontend  │ ───────▶ │   CMS    │ ───────▶ │ Postgres │
│  Next.js   │          │ Next.js  │   5432   │          │
└────────────┘          │ Prisma   │ ◀─────── │          │
       ▲                └──────────┘          │          │
       │ 3002/shop-api                        │          │
       └───────────────▶ ┌──────────┐ ◀────── │          │
                         │ Vendure  │   5432  └──────────┘
                         │ + Worker │
                         └──────────┘
```

---

## Local development (without Docker)

Prerequisites: Node 20+, PostgreSQL 14+ running locally with two databases:
`lingyun_cms` and `lingyun_vendure`.

### 1. Frontend

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

### 2. CMS

```bash
cd cms
cp .env.example .env
# adjust DATABASE_URL if needed
npm install
npx prisma migrate dev
npm run seed         # creates admin@lingyun.local / admin123456 + sample posts
npm run dev          # http://localhost:3001/admin
```

### 3. Vendure

```bash
cd vendure
cp .env.example .env
# adjust DB_* if needed
npm install
npm run migration:run    # initial schema
npm run dev              # server: 3002, admin UI: http://localhost:3003/admin
```

Default Vendure superadmin: `superadmin / superadmin` (override via env).

---

## One-command deployment with Docker Compose

```bash
docker compose up -d --build
```

This will:

1. Spin up Postgres 16 with two databases auto-created (`lingyun_cms`, `lingyun_vendure`).
2. Build & start the CMS, run `prisma migrate deploy`, expose `:3001`.
3. Build & start Vendure server (`:3002`) + Vendure admin UI (`:3003`) + worker.
4. Build & start the frontend on `:3000`, pre-wired to talk to the CMS service inside the Docker network.

After containers are healthy, seed the CMS once:

```bash
docker compose exec cms npm run seed
```

Then visit:

| Service               | URL                                  |
|-----------------------|--------------------------------------|
| Frontend storefront   | http://localhost:3000                |
| Articles (live)       | http://localhost:3000/blog           |
| CMS Admin             | http://localhost:3001/admin          |
| Vendure Shop API      | http://localhost:3002/shop-api       |
| Vendure Admin API     | http://localhost:3002/admin-api      |
| Vendure Admin UI      | http://localhost:3003/admin          |

---

## How the pieces talk

- The frontend reads articles via the public CORS-enabled CMS API:
  - `GET /api/public/posts?limit=20&category=feng-shui&q=bazi`
  - `GET /api/public/posts/:slug`
- The CMS Admin exposes private REST endpoints (`/api/posts`, `/api/categories`,
  `/api/tags`, `/api/media`) protected by JWT cookies (`lingyun_cms_session`).
- TipTap stores rich content as JSON in `Post.content` and renders pre-computed
  HTML to `Post.contentHtml` so the storefront only needs to inject HTML —
  no client-side TipTap on read paths.
- Vendure exposes a Shop GraphQL API (`/shop-api`) the frontend will use later
  for products & cart. Today the storefront still lists curated mock items.

---

## Environment variables

### Frontend (`.env.local`)

```
NEXT_PUBLIC_CMS_URL=http://localhost:3001
NEXT_PUBLIC_VENDURE_SHOP_API=http://localhost:3002/shop-api
```

### CMS (`cms/.env`)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lingyun_cms?schema=public
AUTH_SECRET=<random 32+ chars>
PUBLIC_ALLOWED_ORIGIN=http://localhost:3000
SEED_ADMIN_EMAIL=admin@lingyun.local
SEED_ADMIN_PASSWORD=admin123456
UPLOAD_DIR=public/uploads
PUBLIC_UPLOAD_BASE=/uploads
```

### Vendure (`vendure/.env`)

```
APP_ENV=dev
PORT=3002
COOKIE_SECRET=<random 32+ chars>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lingyun_vendure
DB_USERNAME=postgres
DB_PASSWORD=postgres
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin
SHOP_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3002
```

---

## Authoring workflow

1. Sign in to the CMS at http://localhost:3001/login.
2. **Categories & Tags** → create taxonomies (e.g. "Feng Shui", "BaZi").
3. **Media** → upload imagery (JPG / PNG / WEBP / GIF / SVG, ≤5 MB).
4. **Articles → New** → write with the TipTap editor, choose a cover image,
   pick category & tags, then **Publish**.
5. The frontend `/blog` and `/blog/[slug]` pages will pick the article up
   through the public API (60s revalidation in dev).

---

## Tech stack

| Layer        | Choice                                                       |
|--------------|--------------------------------------------------------------|
| Storefront   | Next.js 14 (App Router), TypeScript, Tailwind, RSC           |
| Theming      | CSS variables + 6 LingYun presets, runtime ThemeStudio       |
| Divination   | In-house BaZi / Five-Elements / Zodiac engine (`src/lib`)    |
| CMS          | Next.js 14 + Prisma + PostgreSQL + TipTap + jose JWT         |
| Commerce     | Vendure 2.x (GraphQL Shop & Admin APIs, AdminUI, Worker)     |
| Storage      | PostgreSQL 16 (two logical DBs)                              |
| Deployment   | Docker Compose (5 services) or local Node/Postgres           |
