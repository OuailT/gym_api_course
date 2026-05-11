import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { auth } from 'express-openid-connect';
import gymRoutes from './routes/gymRoutes';
import profileRoutes from './routes/profileRoutes';

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// ─── Auth0 ────────────────────────────────────────────────────────────────────
const oidcConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.AUTH_BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  errorOnRequiredAuth: true,
  routes: {
    // Override default routes to redirect back to frontend
    login: false,
    logout: false,
  }
};

app.use(auth(oidcConfig));

app.get('/login', (req, res) => {
  res.oidc.login({ returnTo: process.env.CLIENT_ORIGIN || 'http://localhost:5173' });
});

app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: process.env.CLIENT_ORIGIN || 'http://localhost:5173' });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/gyms', gymRoutes);
app.use('/profile', profileRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'Gym API running 🏋️ (TypeScript edition)' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;
