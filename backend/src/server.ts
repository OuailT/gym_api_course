import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { auth, ConfigParams } from 'express-openid-connect';
import gymRoutes from './routes/gymRoutes';
import profileRoutes from './routes/profileRoutes';

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Enable trust proxy for Heroku/Render to handle HTTPS correctly
app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// ─── Auth0 ────────────────────────────────────────────────────────────────────
const oidcConfig: ConfigParams = {
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
  },
  session: {
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    }
  }
};

app.use(auth(oidcConfig));

app.get('/login', (req, res) => {
  const returnTo = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  res.oidc.login({ returnTo });
});

app.get('/logout', (req, res) => {
  const returnTo = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  res.oidc.logout({ returnTo });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/gyms', gymRoutes);
app.use('/profile', profileRoutes);

app.get('/test-auth', (req, res) => {
  res.json({ 
    isAuth: req.oidc.isAuthenticated(), 
    user: req.oidc.user || null,
    cookies: req.headers.cookie || 'No cookies found'
  });
});

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
