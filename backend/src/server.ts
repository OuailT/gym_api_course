import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import gymRoutes from './routes/gymRoutes';
import profileRoutes from './routes/profileRoutes';

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true, // Kept for general compatibility, though not needed for JWT
  })
);

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/gyms', gymRoutes);
app.use('/profile', profileRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'Gym API running 🏋️ (Token-based Auth)' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;
