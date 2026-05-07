import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Gym from '../models/Gym.js';
import Review from '../models/Review.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

router.get('/', async (_req: Request, res: Response) => {
  try {
    const gyms = await Gym.find().sort({ createdAt: -1 });
    res.status(200).json(gyms);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    const gym = await Gym.findById(id).lean();
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    const reviews = await Review.find({ gym: id }).sort({ createdAt: -1 });
    
    res.status(200).json({ ...gym, reviews });
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

    const newGym = new Gym({
      name,
      address,
      description,
      amenities,
      imageUrl
    });

    const savedGym = await newGym.save();
    res.status(201).json(savedGym);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/:id/reviews', requireAuth, async (req: any, res: Response) => {
  try {
    const gymId = req.params.id;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }

    const newReview = new Review({
      gym: gymId,
      rating,
      comment,
      authorSub: req.oidc.user.sub,
      authorName: req.oidc.user.name || req.oidc.user.nickname || 'Anonymous'
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
