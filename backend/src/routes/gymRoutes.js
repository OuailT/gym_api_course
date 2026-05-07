import { Router } from 'express';
import mongoose from 'mongoose';
import Gym from '../models/Gym.js';
import Review from '../models/Review.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

/**
 * GET /gyms
 * Returns an array of all gyms.
 */
router.get('/', async (req, res) => {
  try {
    const gyms = await Gym.find().sort({ createdAt: -1 });
    res.status(200).json(gyms);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * GET /gyms/:id
 * Returns a single gym or 404 if not found.
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    const gym = await Gym.findById(req.params.id).lean();
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Fetch related reviews
    const reviews = await Review.find({ gym: req.params.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ ...gym, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ─── PROTECTED ROUTES (skeletons) ─────────────────────────────────────────────

/**
 * POST /gyms
 * Protected – create a new gym.
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, address, description, amenities, imageUrl } = req.body;
    
    // Basic validation
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
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * POST /gyms/:id/reviews
 * Protected – add a review for a gym.
 */
router.post('/:id/reviews', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const gymId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Check if gym exists
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Basic validation
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
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
