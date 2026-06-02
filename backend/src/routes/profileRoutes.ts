import { Router, Response } from 'express';
import requireAuth from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, (req: any, res: Response) => {
  // req.auth contains the decoded JWT payload
  res.status(200).json({ user: req.auth.payload });
});

export default router;
