import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import questRoutes from './routes/quests.js';
import completionRoutes from './routes/completions.js';
import shopRoutes from './routes/shop.js';
import inventoryRoutes from './routes/inventory.js';
import achievementRoutes from './routes/achievements.js';
import { ensureSeedData } from './seed.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '100kb' }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'lifequest-api', version: '1.0.0' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/completions', completionRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/achievements', achievementRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const conn = await connectDB();
  if (!conn) {
    console.error('[LifeQuest] Aborting — no database connection. Set MONGODB_URI in server/.env first.');
    process.exit(1);
  }
  await ensureSeedData();
  app.listen(PORT, () => {
    console.log(`[LifeQuest] API live on http://localhost:${PORT}`);
    console.log(`[LifeQuest] Client should point here via Vite proxy (client/.env optional CLIENT_ORIGIN).`);
  });
}

bootstrap();