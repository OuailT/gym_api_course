# 🏋️ Swedish Elite Gyms API

A premium full-stack application for discovering and reviewing top-tier gyms in Sweden. 

## 🚀 Tech Stack
- **Frontend**: React (Vite), GSAP, Auth0-React. Hosted on **Netlify**.
- **Backend**: Node.js (Express), TypeScript, Prisma ORM. Hosted on **Render**.
- **Database**: Managed PostgreSQL on **NeonDB**.
- **DevOps**: Docker, GitHub Actions/Workflows.

---

## 🔐 Authentication Evolution: Cookies to JWTs
Originally, the project used session-based cookies via `express-openid-connect`. However, due to modern browser restrictions on "Third-Party Cookies" across different domains (Netlify vs. Render), I transitioned to a **Token-based strategy**:
- **Frontend**: Requests a JWT Access Token from Auth0.
- **Headers**: Sends the token via `Authorization: Bearer <token>`.
- **Backend**: Validates the JWT using `express-oauth2-jwt-bearer`.
This shift resolved all cross-origin 401 errors and is the industry-standard approach for decoupled SPAs.

---

## 📝 Final Project Reflections

### 1. Platform Choice
I chose **Render** for the backend due to its excellent Docker support and seamless environment variable management. **Netlify** was chosen for the frontend for its superior CDN performance and easy SPA redirect handling.

### 2. Docker Challenges
The main challenge was the specific dependencies of **Prisma** on the Linux environment (OpenSSL). Switching from a standard Alpine image to `node-slim` was necessary to ensure the Prisma engine could run correctly in the container.

### 3. Environment Variables (Security)
Environment variables were strictly managed in production dashboards. Key variables include `DATABASE_URL`, `AUTH0_AUDIENCE`, and `CLIENT_ORIGIN`. Sensitive secrets are never committed to version control.

### 4. Authentication Deployment
Deploying auth required precise alignment between Auth0's dashboard settings and the application code—specifically matching **Audience**, **Issuer URLs**, and **Allowed Callback/CORS Origins**. 

### 5. What I'd do differently
If starting over, I would consider a **Monolithic Docker** approach (serving the frontend directly from the Express server) from the beginning. While more complex to set up, it simplifies authentication logic by keeping everything on a single domain, avoiding cross-origin complexities entirely.

---

## 🛠️ How to Run Locally
1. Clone the repo.
2. In `/backend`: `npm install`, then `docker-compose up`.
3. In `/frontend`: `npm install`, then `npm run dev`.
4. Ensure your local `.env` files are configured with your Auth0 and Neon credentials.
