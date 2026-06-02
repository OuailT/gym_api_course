import { Router, Response } from 'express';
import requireAuth from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, (req: any, res: Response) => {
  console.log('Profile Route Cookies:', req.headers.cookie);
  res.status(200).json({ user: req.oidc.user });
});

export default router;
