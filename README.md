# GymReview API

A full-stack Gym Review application built with **Node.js / Express / PostgreSQL** (via Prisma) on the backend and **React + Vite** on the frontend, secured with **Auth0**.

---

## Project Structure

```
gym_api/
├── backend/          # Express API (Prisma/PostgreSQL)
│   ├── prisma/       # Prisma schema
│   ├── generated/    # Generated Prisma client (git-ignored)
│   ├── src/
│   │   ├── config/   # Prisma initialization
│   │   ├── middleware/  # Auth middleware
│   │   ├── routes/   # gymRoutes, profileRoutes
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
└── frontend/         # React + Vite SPA (TypeScript)
    ├── src/
    │   ├── components/  # Navbar
    │   ├── pages/       # Home, GymDetail, Profile
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env.example
    └── package.json
```

---

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `PORT` | Server port (default `3001`) |
| `DATABASE_URL` | PostgreSQL connection string (Neon or Local) |
| `AUTH_SECRET` | Random secret ≥ 32 chars for session signing |
| `AUTH_BASE_URL` | Backend base URL (e.g. `http://localhost:3001`) |
| `AUTH_CLIENT_ID` | Auth0 application Client ID |
| `AUTH_ISSUER_BASE_URL` | `https://<your-tenant>.auth0.com` |
| `CLIENT_ORIGIN` | Frontend origin for CORS (e.g. `http://localhost:5173`) |

### 3. Initialize Database
```bash
npx prisma db push
npm run seed
```

### 4. Run dev server
```bash
npm run dev
```

---

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `VITE_AUTH0_DOMAIN` | Auth0 domain (e.g. `your-tenant.auth0.com`) |
| `VITE_AUTH0_CLIENT_ID` | Auth0 SPA Client ID |
| `VITE_API_BASE_URL` | Backend URL (e.g. `http://localhost:3001`) |

### 3. Run dev server
```bash
npm run dev
```

---

## Auth0 Configuration

1. Create a **Regular Web Application** in Auth0 for the backend.
2. Create a **Single Page Application** in Auth0 for the frontend.
3. Add `http://localhost:5173` to **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**.
