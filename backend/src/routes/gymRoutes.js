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
    // Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }
    res.status(200).json(gym);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ─── PROTECTED ROUTES (skeletons) ─────────────────────────────────────────────

/**
 * POST /gyms
 * Protected – create a new gym.
 * Full logic to be implemented in a later task.
 */
router.post('/', requireAuth, async (req, res) => {
  // TODO: validate body, create Gym document, return 201
  res.status(501).json({ message: 'Not implemented yet' });
});

/**
 * POST /gyms/:id/reviews
 * Protected – add a review for a gym.
 * Full logic to be implemented in a later task.
 */
router.post('/:id/reviews', requireAuth, async (req, res) => {
  // TODO: validate body, link to Gym, create Review document, return 201
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
