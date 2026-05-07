import { Request, Response, NextFunction } from 'express';

/**
 * Custom auth middleware.
 * Returns 401 JSON instead of redirecting when the user is not authenticated.
 */
const requireAuth = (req: any, res: Response, next: NextFunction) => {
  // express-openid-connect adds oidc to req
  if (!req.oidc || !req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized – please log in' });
  }
  next();
};

export default requireAuth;
