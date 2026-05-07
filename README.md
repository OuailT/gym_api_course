# GymReview API

A full-stack Gym Review application built with **Node.js / Express / MongoDB** on the backend and **React + Vite** on the frontend, secured with **Auth0**.

---

## Project Structure

```
gym_api/
├── backend/          # Express API
│   ├── src/
│   │   ├── config/   # MongoDB connection
│   │   ├── middleware/  # Auth middleware
│   │   ├── models/   # Mongoose schemas (Gym, Review)
│   │   ├── routes/   # gymRoutes, profileRoutes
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/         # React + Vite SPA
    ├── src/
    │   ├── components/  # Navbar
    │   ├── pages/       # Home, GymDetail, Profile
    │   ├── App.jsx
    │   └── main.jsx
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
| `PORT` | Server port (default `3000`) |
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | Random secret ≥ 32 chars for session signing |
| `AUTH_BASE_URL` | Backend base URL (e.g. `http://localhost:3000`) |
| `AUTH_CLIENT_ID` | Auth0 application Client ID |
| `AUTH_ISSUER_BASE_URL` | `https://<your-tenant>.auth0.com` |
| `CLIENT_ORIGIN` | Frontend origin for CORS (e.g. `http://localhost:5173`) |

### 3. Run dev server
```bash
npm run dev
```

### Public Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/gyms` | Public | List all gyms |
| `GET` | `/gyms/:id` | Public | Get a single gym (404 if not found) |

### Protected Endpoints (skeleton)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/gyms` | Required | Create a gym |
| `POST` | `/gyms/:id/reviews` | Required | Add a review |
| `GET` | `/profile` | Required | Get current user info |

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
| `VITE_API_BASE_URL` | Backend URL (e.g. `http://localhost:3000`) |

### 3. Run dev server
```bash
npm run dev
```

Opens at **http://localhost:5173**

---

## Auth0 Configuration

1. Create a **Regular Web Application** in Auth0 for the backend (express-openid-connect).
2. Create a **Single Page Application** in Auth0 for the frontend (@auth0/auth0-react).
3. Add `http://localhost:5173` to **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins** in your Auth0 SPA settings.

---

## Security Notes

- CORS is restricted to `CLIENT_ORIGIN` only — **no wildcards**.
- `.env` files are git-ignored and must **never** be committed.
- Protected routes return `401 JSON` (not a redirect) when unauthenticated.
