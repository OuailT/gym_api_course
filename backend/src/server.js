import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { auth } from 'express-openid-connect';
import connectDB from './config/db.js';
import gymRoutes from './routes/gymRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// ─── Connect to MongoDB ────────────────────────────────────────────────────────
await connectDB();

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

// ─── CORS – restricted to the Vite dev server only ────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // e.g. http://localhost:5173
    credentials: true,                 // allow cookies/auth headers
  })
);

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Auth0 / express-openid-connect ───────────────────────────────────────────
const oidcConfig = {
  authRequired: false,          // only specific routes require auth
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.AUTH_BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  // Return 401 instead of redirecting when a protected route is hit without auth
  errorOnRequiredAuth: true,
};

app.use(auth(oidcConfig));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/gyms', gymRoutes);
app.use('/profile', profileRoutes);

// Health-check
app.get('/', (req, res) => {
  res.json({ status: 'Gym API running 🏋️' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
