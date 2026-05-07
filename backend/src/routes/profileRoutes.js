import { Router } from 'express';
import requireAuth from '../middleware/auth.js';

const router = Router();

/**
 * GET /profile
 * Protected – returns the Auth0 user object attached by express-openid-connect.
 */
router.get('/', requireAuth, (req, res) => {
  res.status(200).json({ user: req.oidc.user });
});

export default router;
