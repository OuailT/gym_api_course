# GymReview API 🏋️

A full-stack Gym Review application built with **Node.js (Express)**, **PostgreSQL (Prisma)**, and **React (Vite)**. The application features robust authentication via **Auth0**, integration testing with **Vitest**, and a professional **GitHub Actions** CI pipeline.

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/OuailT/gym_api_course.git
cd gym_api
```

### 2. Install Dependencies
You need to install dependencies for both the backend and frontend:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables
Create `.env` files based on the provided `.env.example` templates.

**Backend (`backend/.env`):**
| Variable | Description |
|---|---|
| `PORT` | Server port (default: `3001`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | 32+ char random string for session signing |
| `AUTH_BASE_URL` | Backend URL (e.g. `http://localhost:3001`) |
| `AUTH_CLIENT_ID` | Auth0 Regular Web App Client ID |
| `AUTH_ISSUER_BASE_URL` | `https://<your-tenant>.auth0.com` |
| `CLIENT_ORIGIN` | Frontend URL (e.g. `http://localhost:5173`) |

**Frontend (`frontend/.env`):**
| Variable | Description |
|---|---|
| `VITE_AUTH0_DOMAIN` | `your-tenant.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | Auth0 SPA Client ID |
| `VITE_API_BASE_URL` | Backend URL (`http://localhost:3001`) |

### 4. Run Locally
```bash
# Start Backend
cd backend
npx prisma db push
npm run dev

# Start Frontend
cd frontend
npm run dev
```

---

## Testing

### Local Tests
Run the test suite across both ends using Vitest:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Test Results
| Suite | Result | Status |
|---|---|---|
| **Backend Integration** | 6 passed, 0 failed | ✅ PASS |
| **Frontend Unit** | 5 passed, 0 failed | ✅ PASS |

![Local Tests Passing Placeholder](https://via.placeholder.com/600x200?text=Vitest+Passing+Output+6/6+and+5/5)

### CI Pipeline
A GitHub Actions pipeline is configured in `.github/workflows/test.yml` to run all tests automatically on every push to `main` or `master`.

![CI Pipeline Passing Placeholder](https://via.placeholder.com/600x200?text=GitHub+Actions+Pipeline+Passing)

---

## Authentication

I implemented **Auth0** using the `express-openid-connect` library for the backend and `@auth0/auth0-react` for the frontend.

### Why Auth0?
- **Session-based Security**: I chose session-based authentication over JWTs in localStorage because session cookies are significantly more resistant to XSS attacks.
- **OAuth Complexity**: Auth0 abstracts the complexity of OAuth flows, identity providers, and user management.
- **Seamless Integration**: `express-openid-connect` provides easy-to-use middleware for protecting routes and accessing user profiles.

### How it works:
- **Backend**: The `auth()` middleware handles login/logout routes. The `oidc.isAuthenticated()` method is used inside custom middleware (`requiresAuth`) to protect sensitive endpoints like `POST /gyms`.
- **Frontend**: The `useAuth0` hook provides the `isAuthenticated` state and `user` object. Authenticated requests are made with `credentials: 'include'` to ensure the session cookie is sent to the backend.

---

## Security Decisions

| Decision | Justification |
|---|---|
| **No Secrets in Repo** | Prevents accidental leaks of credentials and allows for different configurations per environment. |
| **.env.example** | Provides a clear blueprint for developers to set up the project without exposing sensitive values. |
| **401 Unauthenticated** | Adheres to REST standards; the API signals missing credentials clearly so the frontend can respond by prompting login. |
| **Restricted CORS** | Prevents Cross-Site Request Forgery (CSRF) by ensuring only our verified frontend can interact with the API. |
| **No localStorage Storage** | Avoids exposing sensitive tokens to malicious scripts. We rely on HTTP-only session cookies managed by Auth0. |
| **withCredentials: include** | Explicitly enables secure cross-origin requests, allowing the browser to send cookies to the backend API. |

---

## Reflections

### Implementation Choices
- **PostgreSQL + Prisma**: I moved from MongoDB to PostgreSQL to leverage strict relational integrity and the powerful type-safety provided by Prisma client.
- **Folder Structure**: Used a clear `src/routes`, `src/middleware`, and `src/config` separation in the backend to keep the `server.ts` clean and Maintainable.

### Challenges
- **CORS Configuration**: Setting up cross-origin session cookies required careful matching of `credentials: true` on both the backend and frontend.
- **Auth Mocking**: Mocking the complex OIDC request object for integration tests without a live Auth0 server was a significant but rewarding technical hurdle.

### Future Improvements
- **Rate Limiting**: To prevent API abuse, I'd implement `express-rate-limit`.
- **Input Validation**: Adding `express-validator` to ensure all POSTed gym and review data is sanitized and properly formatted.
- **Search & Pagination**: As the database grows, I'd add search filtering and paginated results to the `/gyms` endpoint.
