/**
 * Custom auth middleware.
 * Used on protected routes AFTER express-openid-connect has run.
 * Returns 401 JSON instead of redirecting when the user is not authenticated.
 */
const requireAuth = (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized – please log in' });
  }
  next();
};

export default requireAuth;
