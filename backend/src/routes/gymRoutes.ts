import { Router, Request, Response } from 'express';
import prisma from '../config/prisma.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

router.get('/', async (_req: Request, res: Response) => {
  try {
    const gyms = await prisma.gym.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(gyms);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const gym = await prisma.gym.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    res.status(200).json(gym);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ─── PROTECTED ROUTES ─────────────────────────────────────────────────────────

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, address, description, amenities, imageUrl } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({ error: 'Name and address are required' });
    }

    const newGym = await prisma.gym.create({
      data: {
        name,
        address,
        description,
        amenities: amenities || [],
        imageUrl
      }
    });

    res.status(201).json(newGym);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/:id/reviews', requireAuth, async (req: any, res: Response) => {
  try {
    const gymId = req.params.id as string;
    const { rating, comment } = req.body;

    const gym = await prisma.gym.findUnique({ where: { id: gymId } });
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }

    const newReview = await prisma.review.create({
      data: {
        gymId,
        rating: Number(rating),
        comment,
        authorSub: req.oidc.user.sub,
        authorName: req.oidc.user.name || req.oidc.user.nickname || 'Anonymous'
      }
    });

    res.status(201).json(newReview);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
